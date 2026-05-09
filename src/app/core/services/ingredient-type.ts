import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IngredientType {
  id: number;
  name: string;
  order: number;
  inUse: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class IngredientTypeService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<IngredientType[]> {
    return this.http.get<IngredientType[]>(`${environment.apiUrl}/ingredient-types`);
  }
}
