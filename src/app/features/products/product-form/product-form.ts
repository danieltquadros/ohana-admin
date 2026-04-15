import { Component, OnInit, signal } from '@angular/core';
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
import { CreateProduct, ProductService } from '../product';
import { ProductType, ProductTypeService } from '../../../core/services/product-type';
import { Category, CategoryService } from '../../../core/services/category';
import { UploadService } from '../../../core/services/upload';

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
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  productTypes = signal<ProductType[]>([]);
  categories = signal<Category[]>([]);
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
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
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
      },
      error: () => {
        this.snackBar.open('Produto não encontrado', 'Fechar', { duration: 3000 });
        this.router.navigate(['/products']);
      },
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

    this.loading.set(true);

    const payload = {
      ...this.form,
      price: Number(this.form.price),
      order: Number(this.form.order),
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
