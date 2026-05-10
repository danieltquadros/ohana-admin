import { Component, OnInit, signal } from '@angular/core';
import { Ingredient, IngredientService } from '../ingredient';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [MatSnackBarModule, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.scss',
})
export class IngredientList implements OnInit {
  ingredients = signal<Ingredient[]>([]);
  displayedColumns = ['name', 'description', 'isAllergenic', 'actions'];

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadIngredients();
  }

  loadIngredients() {
    this.ingredientService.findAll().subscribe({
      next: (ingredients) => this.ingredients.set(ingredients),
      error: () =>
        this.snackBar.open('Erro ao carregar ingredientes', 'Fechar', { duration: 3000 }),
    });
  }

  editIngredient(id: number) {
    this.router.navigate(['/ingredients', id, 'edit']);
  }

  deleteIngredient(id: number, title: string) {
    if (confirm(`Tem certeza que deseja excluir o ingrediente "${title}"?`)) {
      this.ingredientService.remove(id).subscribe({
        next: () => {
          this.snackBar.open('Ingrediente excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadIngredients();
        },
        error: () =>
          this.snackBar.open('Erro ao excluir ingrediente', 'Fechar', { duration: 3000 }),
      });
    }
  }

  newIngredient() {
    this.router.navigate(['ingredients', 'new']);
  }
}
