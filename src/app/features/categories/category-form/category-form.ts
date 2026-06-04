import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CategoryKind,
  CategoryService,
  CreateCategory,
} from '../../../core/services/category';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnInit {
  loading = signal(false);
  isEdit = signal(false);
  categoryId: number | null = null;
  technicalName = signal<string>('');

  form: CreateCategory & { isActive: boolean } = {
    label: '',
    description: '',
    type: 'PRODUCT' as CategoryKind,
    order: 0,
    isActive: true,
  };

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.categoryId = +id;
      this.loadCategory(this.categoryId);
    }
  }

  private loadCategory(id: number) {
    this.categoryService.findOne(id).subscribe({
      next: (cat) => {
        this.form = {
          label: cat.label,
          description: cat.description ?? '',
          type: cat.type,
          order: cat.order,
          isActive: cat.isActive,
        };
        this.technicalName.set(cat.name);
      },
      error: () => {
        this.snackBar.open('Categoria não encontrada', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/categories']);
      },
    });
  }

  onSubmit() {
    if (!this.form.label?.trim()) {
      this.snackBar.open('Preencha o nome de exibição', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.loading.set(true);

    const payload: CreateCategory & { isActive: boolean } = {
      ...this.form,
      description: this.form.description?.trim() || undefined,
    };

    const request = this.isEdit()
      ? this.categoryService.update(this.categoryId!, payload)
      : this.categoryService.create(payload);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit() ? 'Categoria atualizada!' : 'Categoria criada!',
          'Fechar',
          { duration: 3000 },
        );
        this.router.navigate(['/categories']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        if (error.status === 409) {
          const message =
            error.error?.message || 'Já existe uma categoria com nome similar';
          this.snackBar.open(message, 'Fechar', { duration: 4000 });
          return;
        }
        this.snackBar.open('Erro ao salvar categoria', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}
