# 🎛️ Ohana Sushi — Admin Panel

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![Angular Material](https://img.shields.io/badge/Angular_Material-21-757575?logo=angular)](https://material.angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)](https://admin.ohanasushidelivery.com.br)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> Admin panel for managing the Ohana Sushi delivery system.
> Built with Angular 21, Angular Material, and CDK.

**Status:** 🟢 Production — Live at [admin.ohanasushidelivery.com.br](https://admin.ohanasushidelivery.com.br)

---

## 📋 Table of Contents

- [About](#-about)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#%EF%B8%8F-project-structure)
- [Available Scripts](#-available-scripts)
- [Deployment](#%EF%B8%8F-deployment)
- [License](#-license)

---

## 🎯 About

This repository is part of the **Ohana Sushi** project — a full-stack delivery system currently in active commercial use.

The full project consists of three integrated applications:

- 🛒 **[ohana_sushi](https://github.com/danieltquadros/ohana_sushi)** — Customer storefront — Next.js
- ⚙️ **[ohana-api](https://github.com/danieltquadros/ohana-api)** — REST API backend — NestJS
- 🎛️ **[ohana-admin](https://github.com/danieltquadros/ohana-admin)** — Admin panel (this repository) — Angular

This admin panel allows administrators to manage products, combos, ingredients, and categories, with role-based access control.

## 🛠️ Tech Stack

- **Framework:** Angular 21
- **Language:** TypeScript
- **UI library:** Angular Material
- **Drag-and-drop:** Angular CDK
- **Styling:** SCSS
- **Reactivity:** Signals + Reactive Forms
- **HTTP:** HttpClient with interceptors
- **Routing:** Angular Router with lazy loading
- **Deploy:** Vercel

## ✨ Features

- 🔐 **Authentication:** JWT-based with token interceptor
- 🛡️ **Authorization:** Route guards integrated with backend RBAC
- 📦 **Product CRUD** with ingredient management (drag-and-drop reordering, duplicate validation, inline ingredient creation)
- 🍱 **Combo CRUD** with product selection (customizable products, validity periods, discounts)
- 🥬 **Ingredient CRUD** with allergen flags
- 📊 **Dashboard** with live entity counts
- 🖼️ **Image upload** integrated with Cloudinary via backend
- 🌐 **Multi-environment:** automatically targets DEV or PRD API based on branch

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (preferred) or npm
- Angular CLI 21+: `npm install -g @angular/cli`

### Installation

```bash
git clone https://github.com/danieltquadros/ohana-admin.git
cd ohana-admin
pnpm install
```

### Running locally

```bash
ng serve
```

App will be available at [http://localhost:4200](http://localhost:4200).

## 🌐 Environment Variables

This project uses Angular's environment files (`src/environments/`):

- `environment.ts` — DEV environment (points to `ohana-api-dev` on Render)
- `environment.prod.ts` — Production environment

For local development pointing to a local API, edit `environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

## 🏗️ Project Structure

```
src/app/
├── core/
│   ├── guards/         # Route guards (auth)
│   ├── interceptors/   # HTTP interceptors (JWT)
│   └── services/       # Singleton services (auth, upload, etc.)
├── features/
│   ├── login/
│   ├── dashboard/
│   ├── products/       # List + form with ingredient management
│   ├── combos/         # List + form with product selection
│   └── ingredients/    # List + form + creation dialog
├── shared/
│   └── components/
│       └── layout/     # Sidebar + header + content wrapper
└── environments/       # DEV/PRD configuration
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `ng serve` | Start dev server (auto-reload) |
| `ng build` | Build for production |
| `pnpm run build:vercel` | Conditional build (DEV/PRD based on branch) |
| `ng test` | Run unit tests |
| `ng generate component <name>` | Scaffold a new component |

## ☁️ Deployment

- **Production:** Vercel — auto-deploy on push to `main` → `https://admin.ohanasushidelivery.com.br`
- **Development:** Vercel — auto-deploy on push to `development` → `https://ohana-admin-git-development-danieltquadros-projects.vercel.app`
- **Build command:** `pnpm run build:vercel` (conditional config based on Git branch)
- **DNS:** Hostinger (CNAME for admin subdomain)

## 📄 License

MIT
