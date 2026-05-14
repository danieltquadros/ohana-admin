import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { CreateProduct, ProductService } from '../product';
import { ProductType, ProductTypeService } from '../../../core/services/product-type';
import { Category, CategoryService } from '../../../core/services/category';
import { UploadService } from '../../../core/services/upload';
import { Ingredient, IngredientService } from '../../ingredients/ingredient';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { IngredientFormDialog } from '../../ingredients/ingredient-form-dialog/ingredient-form-dialog';

interface IngredientRow {
  ingredientId: number | null;
  quantity: number;
  order: number;
}

@Component({
  selector: 'app-product-form',
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
    MatDividerModule,
    DragDropModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  productTypes = signal<ProductType[]>([]);
  categories = signal<Category[]>([]);
  ingredients = signal<Ingredient[]>([]);
  productIngredients = signal<IngredientRow[]>([]);
  loading = signal(false);
  uploading = signal(false);
  isEdit = signal(false);
  productId: number | null = null;
  imagePreview = signal<string | null>(null);

  form: CreateProduct = {
    title: '',
    image: '',
    price: 0,
    order: 0,
    productTypeId: 0,
  };

  constructor(
    private productService: ProductService,
    private productTypeService: ProductTypeService,
    private categoryService: CategoryService,
    private uploadService: UploadService,
    private ingredientService: IngredientService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadSelects();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  private loadSelects() {
    this.productTypeService.findAll().subscribe({
      next: (types) => this.productTypes.set(types),
    });
    this.categoryService.findAll().subscribe({
      next: (categories) => this.categories.set(categories),
    });
    this.ingredientService.findAll().subscribe({
      next: (ingredients) => this.ingredients.set(ingredients),
    });
  }

  private loadProduct(id: number) {
    this.productService.findOne(id).subscribe({
      next: (product) => {
        this.form = {
          title: product.title,
          image: product.image,
          price: product.price,
          order: product.order,
          productTypeId: product.productTypeId,
          categoryId: product.categoryId ?? undefined,
        };
        if (product.image) {
          this.imagePreview.set(product.image);
        }
        if (product.ingredients) {
          this.productIngredients.set(
            product.ingredients.map((pi) => ({
              ingredientId: pi.ingredientId,
              quantity: pi.quantity,
              order: pi.order,
            })),
          );
        }
      },
      error: () => {
        this.snackBar.open('Produto não encontrado', 'Fechar', { duration: 3000 });
        this.router.navigate(['/products']);
      },
    });
  }

  addIngredient() {
    const nextOrder = this.productIngredients().length + 1;
    this.productIngredients.update((rows) => [
      ...rows,
      { ingredientId: null, quantity: 1, order: nextOrder },
    ]);
  }

  removeIngredient(index: number) {
    this.productIngredients.update((rows) => {
      const next = rows.filter((_, i) => i !== index);
      return next.map((r, i) => ({ ...r, order: i + 1 }));
    });
  }

  isIngredientUsed(ingredientId: number, currentIndex: number): boolean {
    return this.productIngredients().some(
      (row, i) => i !== currentIndex && row.ingredientId === ingredientId,
    );
  }

  updateIngredientField(index: number, field: keyof IngredientRow, value: number | null) {
    this.productIngredients.update((rows) =>
      rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  onDropIngredient(event: CdkDragDrop<IngredientRow[]>) {
    this.productIngredients.update((rows) => {
      const next = [...rows];
      moveItemInArray(next, event.previousIndex, event.currentIndex);
      return next.map((r, i) => ({ ...r, order: i + 1 }));
    });
  }

  openCreateIngredientDialog() {
    const ref = this.dialog.open(IngredientFormDialog);

    ref.afterClosed().subscribe((created: Ingredient | null) => {
      if (created) {
        this.ingredients.update((list) => [...list, created]);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      this.snackBar.open('Formato inválido. Use JPG, PNG ou WebP', 'Fechar', { duration: 3000 });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open('Imagem muito grande. Máximo 5MB', 'Fechar', { duration: 3000 });
      return;
    }

    this.uploading.set(true);

    this.uploadService.uploadImage(file).subscribe({
      next: (response) => {
        this.form.image = response.url;
        this.imagePreview.set(response.url);
        this.uploading.set(false);
        this.snackBar.open('Imagem enviada com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.uploading.set(false);
        this.snackBar.open('Erro ao enviar imagem', 'Fechar', { duration: 3000 });
      },
    });
  }

  removeImage() {
    this.form.image = '';
    this.imagePreview.set(null);
  }

  onSubmit() {
    if (!this.form.title || !this.form.productTypeId) {
      this.snackBar.open('Preencha os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }

    const rows = this.productIngredients();
    const invalid = rows.some((r) => !r.ingredientId || r.quantity <= 0);
    if (invalid) {
      this.snackBar.open('Verifique os ingredientes (selecionar e quantidade > 0)', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.loading.set(true);

    const payload: CreateProduct = {
      ...this.form,
      price: Number(this.form.price),
      order: Number(this.form.order),
      ingredients: rows.map((r) => ({
        ingredientId: r.ingredientId!,
        quantity: Number(r.quantity),
        order: Number(r.order),
      })),
    };

    const request = this.isEdit()
      ? this.productService.update(this.productId!, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit() ? 'Produto atualizado!' : 'Produto criado!', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/products']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Erro ao salvar produto', 'Fechar', { duration: 3000 });
      },
    });
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
