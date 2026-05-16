import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { Combo, ComboService } from '../combo';

@Component({
  selector: 'app-combo-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    CurrencyPipe,
  ],
  templateUrl: './combo-list.html',
  styleUrl: './combo-list.scss',
})
export class ComboList implements OnInit {
  combos = signal<Combo[]>([]);
  displayedColumns = ['image', 'name', 'category', 'products', 'price', 'actions'];

  constructor(
    private comboService: ComboService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadCombos();
  }

  loadCombos() {
    this.comboService.findAll().subscribe({
      next: (combos) => this.combos.set(combos),
      error: () => this.snackBar.open('Erro ao carregar combos', 'Fechar', { duration: 3000 }),
    });
  }

  editCombo(id: number) {
    this.router.navigate(['/combos', id, 'edit']);
  }

  deleteCombo(id: number, name: string) {
    if (confirm(`Tem certeza que deseja excluir o combo "${name}"?`)) {
      this.comboService.remove(id).subscribe({
        next: () => {
          this.snackBar.open('Combo excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadCombos();
        },
        error: () => this.snackBar.open('Erro ao excluir combo', 'Fechar', { duration: 3000 }),
      });
    }
  }

  newCombo() {
    this.router.navigate(['/combos', 'new']);
  }
}
