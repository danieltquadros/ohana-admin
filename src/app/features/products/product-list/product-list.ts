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
import { CurrencyPipe } from '@angular/common';
import { Product, ProductService } from '../product';

@Component({
  selector: 'app-product-list',
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
    CurrencyPipe,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  products = signal<Product[]>([]);
  showInactive = signal(false);
  displayedColumns = ['image', 'title', 'type', 'category', 'price', 'status', 'actions'];

  constructor(
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.findAll(this.showInactive()).subscribe({
      next: (products) => this.products.set(products),
      error: () => this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 }),
    });
  }

  onToggleInactive() {
    this.loadProducts();
  }

  editProduct(id: number) {
    this.router.navigate(['/products', id, 'edit']);
  }

  toggleActive(product: Product) {
    const action = product.isActive ? 'desativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${action} "${product.title}"?`)) {
      return;
    }

    this.productService.setActive(product.id, !product.isActive).subscribe({
      next: () => {
        const msg = product.isActive ? 'Produto desativado' : 'Produto ativado';
        this.snackBar.open(msg, 'Fechar', { duration: 3000 });
        this.loadProducts();
      },
      error: () => this.snackBar.open(`Erro ao ${action} produto`, 'Fechar', { duration: 3000 }),
    });
  }

  deleteProduct(id: number, title: string) {
    if (!confirm(`Tem certeza que deseja EXCLUIR definitivamente "${title}"?`)) {
      return;
    }

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

  newProduct() {
    this.router.navigate(['/products', 'new']);
  }
}
