import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Layout } from './shared/components/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/products/product-form/product-form').then((m) => m.ProductForm),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./features/products/product-form/product-form').then((m) => m.ProductForm),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
