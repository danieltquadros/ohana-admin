import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CreateMenuSection,
  MenuSectionKind,
  MenuSectionService,
} from '../../../core/services/menu-section';
import {
  ProductType,
  ProductTypeService,
} from '../../../core/services/product-type';

@Component({
  selector: 'app-menu-section-form',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './menu-section-form.html',
  styleUrl: './menu-section-form.scss',
})
export class MenuSectionForm implements OnInit {
  loading = signal(false);
  isEdit = signal(false);
  sectionId: number | null = null;
  productTypes = signal<ProductType[]>([]);

  form: {
    label: string;
    order: number;
    isActive: boolean;
    kind: MenuSectionKind;
    productTypeId: number | null;
  } = {
    label: '',
    order: 0,
    isActive: true,
    kind: 'PRODUCT_TYPE',
    productTypeId: null,
  };

  constructor(
    private menuSectionService: MenuSectionService,
    private productTypeService: ProductTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadProductTypes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.sectionId = +id;
      this.loadSection(this.sectionId);
    }
  }

  private loadProductTypes() {
    this.productTypeService.findAll(false).subscribe({
      next: (types) => this.productTypes.set(types),
      error: () =>
        this.snackBar.open('Erro ao carregar tipos de produto', 'Fechar', {
          duration: 3000,
        }),
    });
  }

  private loadSection(id: number) {
    this.menuSectionService.findOne(id).subscribe({
      next: (section) => {
        this.form = {
          label: section.label,
          order: section.order,
          isActive: section.isActive,
          kind: section.kind,
          productTypeId: section.productTypeId,
        };
      },
      error: () => {
        this.snackBar.open('Seção não encontrada', 'Fechar', {
          duration: 3000,
        });
        this.router.navigate(['/menu-sections']);
      },
    });
  }

  onKindChange() {
    if (this.form.kind === 'COMBOS') {
      this.form.productTypeId = null;
    }
  }

  onSubmit() {
    if (!this.form.label?.trim()) {
      this.snackBar.open('Preencha o nome de exibição', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    if (this.form.kind === 'PRODUCT_TYPE' && !this.form.productTypeId) {
      this.snackBar.open(
        'Selecione um tipo de produto para a seção',
        'Fechar',
        { duration: 3000 },
      );
      return;
    }

    this.loading.set(true);

    const payload: CreateMenuSection = {
      label: this.form.label,
      order: this.form.order,
      isActive: this.form.isActive,
      kind: this.form.kind,
      productTypeId:
        this.form.kind === 'PRODUCT_TYPE'
          ? this.form.productTypeId!
          : undefined,
    };

    const request = this.isEdit()
      ? this.menuSectionService.update(this.sectionId!, payload)
      : this.menuSectionService.create(payload);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit() ? 'Seção atualizada!' : 'Seção criada!',
          'Fechar',
          { duration: 3000 },
        );
        this.router.navigate(['/menu-sections']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        const message = error.error?.message;
        if (error.status === 409 || error.status === 400) {
          this.snackBar.open(
            Array.isArray(message)
              ? message.join('. ')
              : message || 'Não foi possível salvar a seção',
            'Fechar',
            { duration: 4000 },
          );
          return;
        }
        this.snackBar.open('Erro ao salvar seção', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  cancel() {
    this.router.navigate(['/menu-sections']);
  }
}
