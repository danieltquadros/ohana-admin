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
import { Combo, ComboService } from '../combo';

@Component({
  selector: 'app-combo-list',
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
  templateUrl: './combo-list.html',
  styleUrl: './combo-list.scss',
})
export class ComboList implements OnInit {
  combos = signal<Combo[]>([]);
  showInactive = signal(false);
  displayedColumns = ['image', 'name', 'category', 'products', 'price', 'status', 'actions'];

  constructor(
    private comboService: ComboService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadCombos();
  }

  loadCombos() {
    this.comboService.findAll(this.showInactive()).subscribe({
      next: (combos) => this.combos.set(combos),
      error: () => this.snackBar.open('Erro ao carregar combos', 'Fechar', { duration: 3000 }),
    });
  }

  onToggleInactive() {
    this.loadCombos();
  }

  editCombo(id: number) {
    this.router.navigate(['/combos', id, 'edit']);
  }

  toggleActive(combo: Combo) {
    const action = combo.isActive ? 'desativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${action} o combo "${combo.name}"?`)) {
      return;
    }

    this.comboService.setActive(combo.id, !combo.isActive).subscribe({
      next: () => {
        const msg = combo.isActive ? 'Combo desativado' : 'Combo ativado';
        this.snackBar.open(msg, 'Fechar', { duration: 3000 });
        this.loadCombos();
      },
      error: () => this.snackBar.open(`Erro ao ${action} combo`, 'Fechar', { duration: 3000 }),
    });
  }

  deleteCombo(id: number, name: string) {
    if (!confirm(`Tem certeza que deseja EXCLUIR definitivamente o combo "${name}"?`)) {
      return;
    }

    this.comboService.remove(id).subscribe({
      next: () => {
        this.snackBar.open('Combo excluído com sucesso', 'Fechar', { duration: 3000 });
        this.loadCombos();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message = error.error?.message || 'Não é possível excluir este combo';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          return;
        }
        this.snackBar.open('Erro ao excluir combo', 'Fechar', { duration: 3000 });
      },
    });
  }

  newCombo() {
    this.router.navigate(['/combos', 'new']);
  }
}
