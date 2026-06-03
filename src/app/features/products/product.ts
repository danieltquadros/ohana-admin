import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductIngredientItem {
  ingredientId: number;
  quantity: number;
  order: number;
  ingredient?: { id: number; name: string };
}

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  order: number;
  isActive: boolean;
  productTypeId: number;
  categoryId: number | null;
  type?: { id: number; name: string };
  category?: { id: number; name: string };
  ingredients?: ProductIngredientItem[];
}

export interface CreateProduct {
  title: string;
  image: string;
  price: number;
  order: number;
  productTypeId: number;
  categoryId?: number;
  ingredients?: { ingredientId: number; quantity: number; order: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  findAll(includeInactive = false): Observable<Product[]> {
    const url = includeInactive ? `${this.url}?includeInactive=true` : this.url;
    return this.http.get<Product[]>(url);
  }

  findOne(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  update(id: number, product: Partial<CreateProduct>): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${id}`, product);
  }

  setActive(id: number, isActive: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${id}`, { isActive });
  }

  remove(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.url}/${id}`);
  }
}
