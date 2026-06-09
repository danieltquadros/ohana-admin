import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CreateCombo, ComboService } from '../combo';
import { Product, ProductService } from '../../products/product';
import { Category, CategoryService } from '../../../core/services/category';
import { UploadService } from '../../../core/services/upload';

interface ComboProductRow {
  productId: number | null;
  quantity: number;
  order: number;
  isCustomizable: boolean;
}

@Component({
  selector: 'app-combo-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDividerModule,
    MatDatepickerModule,
    DragDropModule,
  ],
  templateUrl: './combo-form.html',
  styleUrl: './combo-form.scss',
})
export class ComboForm implements OnInit {
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  comboProducts = signal<ComboProductRow[]>([]);
  loading = signal(false);
  uploading = signal(false);
  isEdit = signal(false);
  comboId: number | null = null;
  imagePreview = signal<string | null>(null);

  form: CreateCombo = {
    name: '',
    description: '',
    image: '',
    price: 0,
    order: 0,
    discount: undefined,
    validFrom: undefined,
    validUntil: undefined,
    categoryId: undefined,
  };

  constructor(
    private comboService: ComboService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadSelects();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.comboId = +id;
      this.loadCombo(this.comboId);
    }
  }

  private loadSelects() {
    this.categoryService.findAll().subscribe({
      next: (categories) => this.categories.set(categories),
    });
    this.productService.findAll().subscribe({
      next: (products) => this.products.set(products),
    });
  }

  private loadCombo(id: number) {
    this.comboService.findOne(id).subscribe({
      next: (combo) => {
        this.form = {
          name: combo.name,
          description: combo.description ?? '',
          image: combo.image,
          price: combo.price,
          order: combo.order,
          discount: combo.discount,
          validFrom: combo.validFrom,
          validUntil: combo.validUntil,
          categoryId: combo.categoryId,
        };
        if (combo.image) {
          this.imagePreview.set(combo.image);
        }
        if (combo.products) {
          this.comboProducts.set(
            combo.products.map((cp) => ({
              productId: cp.productId,
              quantity: cp.quantity,
              order: cp.order,
              isCustomizable: cp.isCustomizable,
            })),
          );
        }
      },
      error: () => {
        this.snackBar.open('Combo não encontrado', 'Fechar', { duration: 3000 });
        this.router.navigate(['/combos']);
      },
    });
  }

  addProduct() {
    const nextOrder = this.comboProducts().length + 1;
    this.comboProducts.update((rows) => [
      ...rows,
      { productId: null, quantity: 1, order: nextOrder, isCustomizable: false },
    ]);
  }

  removeProduct(index: number) {
    this.comboProducts.update((rows) => {
      const next = rows.filter((_, i) => i !== index);
      return next.map((r, i) => ({ ...r, order: i + 1 }));
    });
  }

  updateProductField(index: number, field: keyof ComboProductRow, value: number | boolean | null) {
    this.comboProducts.update((rows) =>
      rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  isProductUsed(productId: number, currentIndex: number): boolean {
    return this.comboProducts().some((row, i) => i !== currentIndex && row.productId === productId);
  }

  onDropProduct(event: CdkDragDrop<ComboProductRow[]>) {
    this.comboProducts.update((rows) => {
      const next = [...rows];
      moveItemInArray(next, event.previousIndex, event.currentIndex);
      return next.map((r, i) => ({ ...r, order: i + 1 }));
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
    if (!this.form.name) {
      this.snackBar.open('Preencha os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }

    const rows = this.comboProducts();
    const invalid = rows.some((r) => !r.productId || r.quantity <= 0);
    if (invalid) {
      this.snackBar.open('Verifique os produtos (selecionar e quantidade > 0)', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.loading.set(true);

    const payload: CreateCombo = {
      ...this.form,
      price: Number(this.form.price),
      order: Number(this.form.order),
      discount: this.form.discount !== undefined ? Number(this.form.discount) : undefined,
      products: rows.map((r) => ({
        productId: r.productId!,
        quantity: Number(r.quantity),
        order: Number(r.order),
        isCustomizable: r.isCustomizable,
      })),
    };

    const request = this.isEdit()
      ? this.comboService.update(this.comboId!, payload)
      : this.comboService.create(payload);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit() ? 'Combo atualizado!' : 'Combo criado!', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/combos']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Erro ao salvar combo', 'Fechar', { duration: 3000 });
      },
    });
  }

  cancel() {
    this.router.navigate(['/combos']);
  }
}
