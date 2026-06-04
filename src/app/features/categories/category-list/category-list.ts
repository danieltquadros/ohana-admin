import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Category, CategoryService } from '../../../core/services/category';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit {
  categories = signal<Category[]>([]);
  showInactive = signal(false);
  displayedColumns = ['label', 'name', 'type', 'order', 'status', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.findAll(this.showInactive()).subscribe({
      next: (categories) => this.categories.set(categories),
      error: () =>
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', {
          duration: 3000,
        }),
    });
  }

  onToggleInactive() {
    this.loadCategories();
  }

  editCategory(id: number) {
    this.router.navigate(['/categories', id, 'edit']);
  }

  toggleActive(category: Category) {
    const action = category.isActive ? 'desativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${action} "${category.label}"?`)) {
      return;
    }

    this.categoryService
      .setActive(category.id, !category.isActive)
      .subscribe({
        next: () => {
          const msg = category.isActive
            ? 'Categoria desativada'
            : 'Categoria ativada';
          this.snackBar.open(msg, 'Fechar', { duration: 3000 });
          this.loadCategories();
        },
        error: () =>
          this.snackBar.open(`Erro ao ${action} categoria`, 'Fechar', {
            duration: 3000,
          }),
      });
  }

  deleteCategory(id: number, label: string) {
    if (!confirm(`Tem certeza que deseja EXCLUIR definitivamente "${label}"?`)) {
      return;
    }

    this.categoryService.remove(id).subscribe({
      next: () => {
        this.snackBar.open('Categoria excluída com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.loadCategories();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message =
            error.error?.message || 'Não é possível excluir esta categoria';
          this.snackBar.open(message, 'Fechar', { duration: 4000 });
          return;
        }
        this.snackBar.open('Erro ao excluir categoria', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  newCategory() {
    this.router.navigate(['/categories', 'new']);
  }
}
