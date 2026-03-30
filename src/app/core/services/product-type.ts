import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductType {
  id: number;
  name: string;
  order: number;
  inUse: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${environment.apiUrl}/product-types`);
  }
}
