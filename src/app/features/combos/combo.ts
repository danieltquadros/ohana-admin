import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ComboProductItem {
  productId: number;
  quantity: number;
  order: number;
  isCustomizable: boolean;
  product?: { id: number; title: string; image: string };
}

export interface Combo {
  id: number;
  name: string;
  description?: string;
  image: string;
  price: number;
  order: number;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  discount?: number;
  categoryId?: number;
  category?: { id: number; name: string };
  products?: ComboProductItem[];
}

export interface CreateCombo {
  name: string;
  description?: string;
  image: string;
  price: number;
  order: number;
  validFrom?: string;
  validUntil?: string;
  discount?: number;
  categoryId?: number;
  products?: {
    productId: number;
    quantity: number;
    order: number;
    isCustomizable: boolean;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ComboService {
  private url = `${environment.apiUrl}/combos`;

  constructor(private http: HttpClient) {}

  findAll(includeInactive = false): Observable<Combo[]> {
    const url = includeInactive ? `${this.url}?includeInactive=true` : this.url;
    return this.http.get<Combo[]>(url);
  }

  findOne(id: number): Observable<Combo> {
    return this.http.get<Combo>(`${this.url}/${id}`);
  }

  create(combo: CreateCombo): Observable<Combo> {
    return this.http.post<Combo>(this.url, combo);
  }

  update(id: number, combo: Partial<CreateCombo>): Observable<Combo> {
    return this.http.patch<Combo>(`${this.url}/${id}`, combo);
  }

  setActive(id: number, isActive: boolean): Observable<Combo> {
    return this.http.patch<Combo>(`${this.url}/${id}`, { isActive });
  }

  remove(id: number): Observable<Combo> {
    return this.http.delete<Combo>(`${this.url}/${id}`);
  }
}
