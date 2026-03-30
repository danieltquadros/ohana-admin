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
import { Product, CreateProduct, ProductService } from '../product';
import { ProductType, ProductTypeService } from '../../../core/services/product-type';
import { Category, CategoryService } from '../../../core/services/category';

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
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  productTypes = signal<ProductType[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  isEdit = signal(false);
  productId: number | null = null;

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
      },
      error: () => {
        this.snackBar.open('Produto não encontrado', 'Fechar', { duration: 3000 });
        this.router.navigate(['/products']);
      },
    });
  }

  onSubmit() {
    if (!this.form.title || !this.form.productTypeId) {
      this.snackBar.open('Preencha os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading.set(true);

    const request = this.isEdit()
      ? this.productService.update(this.productId!, this.form)
      : this.productService.create(this.form);

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
