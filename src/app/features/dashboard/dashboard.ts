import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { environment } from '../../../environments/environment';

interface DashboardStats {
  products: number;
  categories: number;
  combos: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatGridListModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  stats = signal<DashboardStats>({ products: 0, categories: 0, combos: 0 });

  cards = [
    { title: 'Produtos', icon: 'restaurant_menu', key: 'products' as const },
    { title: 'Categorias', icon: 'category', key: 'categories' as const },
    { title: 'Combos', icon: 'local_offer', key: 'combos' as const },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.http.get<any[]>(`${environment.apiUrl}/products`).subscribe({
      next: (products) => this.stats.update((s) => ({ ...s, products: products.length })),
    });

    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (categories) => this.stats.update((s) => ({ ...s, categories: categories.length })),
    });

    this.http.get<any[]>(`${environment.apiUrl}/combos`).subscribe({
      next: (combos) => this.stats.update((s) => ({ ...s, combos: combos.length })),
    });
  }

  getStatValue(key: string): number {
    return this.stats()[key as keyof DashboardStats] || 0;
  }
}
