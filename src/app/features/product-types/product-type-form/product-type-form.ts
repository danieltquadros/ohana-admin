import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CreateProductType,
  ProductTypeService,
} from '../../../core/services/product-type';

@Component({
  selector: 'app-product-type-form',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-type-form.html',
  styleUrl: './product-type-form.scss',
})
export class ProductTypeForm implements OnInit {
  loading = signal(false);
  isEdit = signal(false);
  productTypeId: number | null = null;
  technicalName = signal<string>('');

  form: CreateProductType & { isActive: boolean } = {
    label: '',
    isActive: true,
  };

  constructor(
    private productTypeService: ProductTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.productTypeId = +id;
      this.loadProductType(this.productTypeId);
    }
  }

  private loadProductType(id: number) {
    this.productTypeService.findOne(id).subscribe({
      next: (type) => {
        this.form = {
          label: type.label,
          isActive: type.isActive,
        };
        this.technicalName.set(type.name);
      },
      error: () => {
        this.snackBar.open('Tipo de produto não encontrado', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/product-types']);
      },
    });
  }

  onSubmit() {
    if (!this.form.label?.trim()) {
      this.snackBar.open('Preencha o nome de exibição', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.loading.set(true);

    const request = this.isEdit()
      ? this.productTypeService.update(this.productTypeId!, this.form)
      : this.productTypeService.create(this.form);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit() ? 'Tipo atualizado!' : 'Tipo criado!',
          'Fechar',
          { duration: 3000 },
        );
        this.router.navigate(['/product-types']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        if (error.status === 409) {
          const message =
            error.error?.message || 'Já existe um tipo com nome similar';
          this.snackBar.open(message, 'Fechar', { duration: 4000 });
          return;
        }
        this.snackBar.open('Erro ao salvar tipo', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  cancel() {
    this.router.navigate(['/product-types']);
  }
}
