import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { Product, ProductService } from '../product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    CurrencyPipe,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  products = signal<Product[]>([]);
  displayedColumns = ['image', 'title', 'type', 'category', 'price', 'actions'];

  constructor(
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.findAll().subscribe({
      next: (products) => this.products.set(products),
      error: () => this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 }),
    });
  }

  editProduct(id: number) {
    this.router.navigate(['/products', id, 'edit']);
  }

  deleteProduct(id: number, title: string) {
    if (confirm(`Tem certeza que deseja excluir "${title}"?`)) {
      this.productService.remove(id).subscribe({
        next: () => {
          this.snackBar.open('Produto excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadProducts();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            const message = error.error?.message || 'Não é possível excluir este produto';
            this.snackBar.open(message, 'Fechar', { duration: 3000 });
            return;
          }
          this.snackBar.open('Erro ao excluir produto', 'Fechar', { duration: 3000 });
        },
      });
    }
  }

  newProduct() {
    this.router.navigate(['/products', 'new']);
  }
}
