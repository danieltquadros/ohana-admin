import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type CategoryKind = 'PRODUCT' | 'COMBO';

export interface Category {
  id: number;
  name: string;
  label: string;
  description?: string;
  type: CategoryKind;
  order: number;
  isActive: boolean;
}

export interface CreateCategory {
  label: string;
  description?: string;
  type: CategoryKind;
  order: number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private url = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  findAll(includeInactive = false): Observable<Category[]> {
    const url = includeInactive ? `${this.url}?includeInactive=true` : this.url;
    return this.http.get<Category[]>(url);
  }

  findOne(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  create(category: CreateCategory): Observable<Category> {
    return this.http.post<Category>(this.url, category);
  }

  update(
    id: number,
    category: Partial<CreateCategory>,
  ): Observable<Category> {
    return this.http.patch<Category>(`${this.url}/${id}`, category);
  }

  setActive(id: number, isActive: boolean): Observable<Category> {
    return this.http.patch<Category>(`${this.url}/${id}`, { isActive });
  }

  remove(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.url}/${id}`);
  }
}
