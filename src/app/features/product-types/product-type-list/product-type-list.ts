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
import { ProductType, ProductTypeService } from '../../../core/services/product-type';

@Component({
  selector: 'app-product-type-list',
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
  ],
  templateUrl: './product-type-list.html',
  styleUrl: './product-type-list.scss',
})
export class ProductTypeList implements OnInit {
  productTypes = signal<ProductType[]>([]);
  showInactive = signal(false);
  displayedColumns = ['label', 'name', 'status', 'actions'];

  constructor(
    private productTypeService: ProductTypeService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadProductTypes();
  }

  loadProductTypes() {
    this.productTypeService.findAll(this.showInactive()).subscribe({
      next: (types) => this.productTypes.set(types),
      error: () =>
        this.snackBar.open('Erro ao carregar tipos de produto', 'Fechar', {
          duration: 3000,
        }),
    });
  }

  onToggleInactive() {
    this.loadProductTypes();
  }

  editProductType(id: number) {
    this.router.navigate(['/product-types', id, 'edit']);
  }

  toggleActive(productType: ProductType) {
    const action = productType.isActive ? 'desativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${action} "${productType.label}"?`)) {
      return;
    }

    this.productTypeService
      .setActive(productType.id, !productType.isActive)
      .subscribe({
        next: () => {
          const msg = productType.isActive ? 'Tipo desativado' : 'Tipo ativado';
          this.snackBar.open(msg, 'Fechar', { duration: 3000 });
          this.loadProductTypes();
        },
        error: () =>
          this.snackBar.open(`Erro ao ${action} tipo`, 'Fechar', {
            duration: 3000,
          }),
      });
  }

  deleteProductType(id: number, label: string) {
    if (!confirm(`Tem certeza que deseja EXCLUIR definitivamente "${label}"?`)) {
      return;
    }

    this.productTypeService.remove(id).subscribe({
      next: () => {
        this.snackBar.open('Tipo excluído com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.loadProductTypes();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message =
            error.error?.message || 'Não é possível excluir este tipo';
          this.snackBar.open(message, 'Fechar', { duration: 4000 });
          return;
        }
        this.snackBar.open('Erro ao excluir tipo', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  newProductType() {
    this.router.navigate(['/product-types', 'new']);
  }
}
