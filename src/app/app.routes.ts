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
        path: 'ingredients',
        loadComponent: () =>
          import('./features/ingredients/ingredient-list/ingredient-list').then(
            (m) => m.IngredientList,
          ),
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
        path: 'ingredients/new',
        loadComponent: () =>
          import('./features/ingredients/ingredient-form/ingredient-form').then(
            (m) => m.IngredientForm,
          ),
      },
      {
        path: 'ingredients/:id/edit',
        loadComponent: () =>
          import('./features/ingredients/ingredient-form/ingredient-form').then(
            (m) => m.IngredientForm,
          ),
      },
      {
        path: 'combos',
        loadComponent: () =>
          import('./features/combos/combo-list/combo-list').then((m) => m.ComboList),
      },
      {
        path: 'combos/new',
        loadComponent: () =>
          import('./features/combos/combo-form/combo-form').then((m) => m.ComboForm),
      },
      {
        path: 'combos/:id/edit',
        loadComponent: () =>
          import('./features/combos/combo-form/combo-form').then((m) => m.ComboForm),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/category-list/category-list').then(
            (m) => m.CategoryList,
          ),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('./features/categories/category-form/category-form').then(
            (m) => m.CategoryForm,
          ),
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () =>
          import('./features/categories/category-form/category-form').then(
            (m) => m.CategoryForm,
          ),
      },
      {
        path: 'menu-sections',
        loadComponent: () =>
          import(
            './features/menu-sections/menu-section-list/menu-section-list'
          ).then((m) => m.MenuSectionList),
      },
      {
        path: 'menu-sections/new',
        loadComponent: () =>
          import(
            './features/menu-sections/menu-section-form/menu-section-form'
          ).then((m) => m.MenuSectionForm),
      },
      {
        path: 'menu-sections/:id/edit',
        loadComponent: () =>
          import(
            './features/menu-sections/menu-section-form/menu-section-form'
          ).then((m) => m.MenuSectionForm),
      },
      {
        path: 'product-types',
        loadComponent: () =>
          import(
            './features/product-types/product-type-list/product-type-list'
          ).then((m) => m.ProductTypeList),
      },
      {
        path: 'product-types/new',
        loadComponent: () =>
          import(
            './features/product-types/product-type-form/product-type-form'
          ).then((m) => m.ProductTypeForm),
      },
      {
        path: 'product-types/:id/edit',
        loadComponent: () =>
          import(
            './features/product-types/product-type-form/product-type-form'
          ).then((m) => m.ProductTypeForm),
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
