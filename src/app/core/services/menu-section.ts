import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductType } from './product-type';

export type MenuSectionKind = 'PRODUCT_TYPE' | 'COMBOS';

export interface MenuSection {
  id: number;
  label: string;
  order: number;
  isActive: boolean;
  kind: MenuSectionKind;
  productTypeId: number | null;
  productType: ProductType | null;
}

export interface CreateMenuSection {
  label: string;
  order: number;
  isActive?: boolean;
  kind: MenuSectionKind;
  productTypeId?: number;
}

export interface UpdateMenuSection {
  label?: string;
  order?: number;
  isActive?: boolean;
  kind?: MenuSectionKind;
  productTypeId?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class MenuSectionService {
  private url = `${environment.apiUrl}/menu-sections`;

  constructor(private http: HttpClient) {}

  findAll(includeInactive = false): Observable<MenuSection[]> {
    const url = includeInactive ? `${this.url}?includeInactive=true` : this.url;
    return this.http.get<MenuSection[]>(url);
  }

  findOne(id: number): Observable<MenuSection> {
    return this.http.get<MenuSection>(`${this.url}/${id}`);
  }

  create(payload: CreateMenuSection): Observable<MenuSection> {
    return this.http.post<MenuSection>(this.url, payload);
  }

  update(id: number, payload: UpdateMenuSection): Observable<MenuSection> {
    return this.http.patch<MenuSection>(`${this.url}/${id}`, payload);
  }

  setActive(id: number, isActive: boolean): Observable<MenuSection> {
    return this.http.patch<MenuSection>(`${this.url}/${id}`, { isActive });
  }

  setOrder(id: number, order: number): Observable<MenuSection> {
    return this.http.patch<MenuSection>(`${this.url}/${id}`, { order });
  }

  remove(id: number): Observable<MenuSection> {
    return this.http.delete<MenuSection>(`${this.url}/${id}`);
  }
}
