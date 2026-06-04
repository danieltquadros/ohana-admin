import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/products', icon: 'restaurant_menu', label: 'Produtos' },
    { path: '/ingredients', icon: 'local_florist', label: 'Ingredientes' },
    { path: '/combos', icon: 'local_offer', label: 'Combos' },
    { path: '/categories', icon: 'category', label: 'Categorias' },
    { path: '/product-types', icon: 'sell', label: 'Tipos de Produto' },
    { path: '/menu-sections', icon: 'view_list', label: 'Seções do Menu' },
  ];

  constructor(private authService: AuthService) {}

  get userName(): string {
    return this.authService.user()?.firstName || 'Admin';
  }

  logout() {
    this.authService.logout();
  }
}
