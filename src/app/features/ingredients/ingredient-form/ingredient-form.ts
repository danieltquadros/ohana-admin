import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IngredientType, IngredientTypeService } from '../../../core/services/ingredient-type';
import { IngredientService } from '../ingredient';
import { UploadService } from '../../../core/services/upload';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ingredient-form',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.scss',
})
export class IngredientForm implements OnInit {
  ingredientTypes = signal<IngredientType[]>([]);
  loading = signal(false);
  uploading = signal(false);
  isEdit = signal(false);
  ingredientId: number | null = null;

  form = {
    name: '',
    description: '',
    isAllergenic: false,
  };

  constructor(
    private ingredientService: IngredientService,
    private ingredientTypeService: IngredientTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadSelects();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.ingredientId = +id;
      this.loadIngredient(this.ingredientId);
    }
  }

  private loadSelects() {
    this.ingredientTypeService.findAll().subscribe({
      next: (types) => this.ingredientTypes.set(types),
      // error: () => this.snackBar.open('Failed to load ingredient types', 'Close', { duration: 3000 }),
    });
  }

  private loadIngredient(id: number) {
    this.ingredientService.findOne(id).subscribe({
      next: (ingredient) => {
        this.form = {
          name: ingredient.name,
          description: ingredient.description || '',
          isAllergenic: ingredient.isAllergenic || false,
        };
      },

      error: () => {
        this.snackBar.open('Failed to load ingredient', 'Close', { duration: 3000 });
        this.router.navigate(['/ingredients']);
      },
    });
  }

  onSubmit() {
    if (!this.form.name) {
      this.snackBar.open('Name is required', 'Close', { duration: 3000 });
      return;
    }

    this.loading.set(true);

    const request =
      this.isEdit() && this.ingredientId
        ? this.ingredientService.update(this.ingredientId, this.form)
        : this.ingredientService.create(this.form);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open(
          this.isEdit() ? 'Ingrediente atualizado!' : 'Ingrediente criado!',
          'Fechar',
          { duration: 3000 },
        );
        this.router.navigate(['/ingredients']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Erro ao salvar ingrediente', 'Fechar', { duration: 3000 });
      },
    });
  }

  cancel() {
    this.router.navigate(['/ingredients']);
  }
}
