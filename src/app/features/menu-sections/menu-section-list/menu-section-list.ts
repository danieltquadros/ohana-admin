import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MenuSection,
  MenuSectionService,
} from '../../../core/services/menu-section';

@Component({
  selector: 'app-menu-section-list',
  standalone: true,
  imports: [
    FormsModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './menu-section-list.html',
  styleUrl: './menu-section-list.scss',
})
export class MenuSectionList implements OnInit {
  sections = signal<MenuSection[]>([]);
  showInactive = signal(false);
  saving = signal(false);

  constructor(
    private menuSectionService: MenuSectionService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadSections();
  }

  loadSections() {
    this.menuSectionService.findAll(this.showInactive()).subscribe({
      next: (sections) => this.sections.set(sections),
      error: () =>
        this.snackBar.open('Erro ao carregar seções', 'Fechar', {
          duration: 3000,
        }),
    });
  }

  onToggleInactive() {
    this.loadSections();
  }

  onDrop(event: CdkDragDrop<MenuSection[]>) {
    if (event.previousIndex === event.currentIndex) return;

    const current = [...this.sections()];
    moveItemInArray(current, event.previousIndex, event.currentIndex);

    const updates: { id: number; order: number }[] = [];
    current.forEach((section, idx) => {
      const newOrder = idx + 1;
      if (section.order !== newOrder) {
        updates.push({ id: section.id, order: newOrder });
      }
    });

    const optimistic = current.map((section, idx) => ({
      ...section,
      order: idx + 1,
    }));
    this.sections.set(optimistic);

    if (updates.length === 0) return;

    this.saving.set(true);
    forkJoin(
      updates.map((u) => this.menuSectionService.setOrder(u.id, u.order)),
    ).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open('Ordem atualizada', 'Fechar', { duration: 2000 });
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open(
          'Erro ao salvar ordem. Recarregando...',
          'Fechar',
          { duration: 3000 },
        );
        this.loadSections();
      },
    });
  }

  editSection(id: number) {
    this.router.navigate(['/menu-sections', id, 'edit']);
  }

  toggleActive(section: MenuSection) {
    const action = section.isActive ? 'desativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${action} "${section.label}"?`)) {
      return;
    }

    this.menuSectionService
      .setActive(section.id, !section.isActive)
      .subscribe({
        next: () => {
          const msg = section.isActive
            ? 'Seção desativada'
            : 'Seção ativada';
          this.snackBar.open(msg, 'Fechar', { duration: 3000 });
          this.loadSections();
        },
        error: () =>
          this.snackBar.open(`Erro ao ${action} seção`, 'Fechar', {
            duration: 3000,
          }),
      });
  }

  deleteSection(id: number, label: string) {
    if (!confirm(`Tem certeza que deseja EXCLUIR definitivamente "${label}"?`)) {
      return;
    }

    this.menuSectionService.remove(id).subscribe({
      next: () => {
        this.snackBar.open('Seção excluída com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.loadSections();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          const message =
            error.error?.message || 'Não é possível excluir esta seção';
          this.snackBar.open(message, 'Fechar', { duration: 4000 });
          return;
        }
        this.snackBar.open('Erro ao excluir seção', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  newSection() {
    this.router.navigate(['/menu-sections', 'new']);
  }
}
