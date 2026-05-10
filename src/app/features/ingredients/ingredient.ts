import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ingredient {
  id: number;
  name: string;
  description?: string;
  isAllergenic?: boolean;
}

export interface CreateIngredient {
  name: string;
  description?: string;
  isAllergenic?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private url = `${environment.apiUrl}/ingredients`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.url);
  }

  findOne(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.url}/${id}`);
  }

  create(ingredient: CreateIngredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.url, ingredient);
  }

  update(id: number, ingredient: Partial<CreateIngredient>): Observable<Ingredient> {
    return this.http.patch<Ingredient>(`${this.url}/${id}`, ingredient);
  }

  remove(id: number): Observable<Ingredient> {
    return this.http.delete<Ingredient>(`${this.url}/${id}`);
  }
}
