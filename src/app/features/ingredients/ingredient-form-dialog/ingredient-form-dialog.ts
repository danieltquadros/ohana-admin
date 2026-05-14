import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateIngredient, Ingredient, IngredientService } from '../ingredient';

@Component({
  selector: 'app-ingredient-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ingredient-form-dialog.html',
  styleUrl: './ingredient-form-dialog.scss',
})
export class IngredientFormDialog {
  saving = signal(false);

  form: CreateIngredient = {
    name: '',
    description: '',
    isAllergenic: false,
  };

  constructor(
    private dialogRef: MatDialogRef<IngredientFormDialog, Ingredient | null>,
    private ingredientService: IngredientService,
    private snackBar: MatSnackBar,
  ) {}

  onSubmit() {
    if (!this.form.name) {
      this.snackBar.open('Informe o nome do ingrediente', 'Fechar', { duration: 3000 });
      return;
    }

    this.saving.set(true);

    this.ingredientService.create(this.form).subscribe({
      next: (created) => {
        this.snackBar.open('Ingrediente criado!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(created);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Erro ao criar ingrediente', 'Fechar', { duration: 3000 });
      },
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
