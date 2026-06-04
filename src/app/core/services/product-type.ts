import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductType {
  id: number;
  name: string;
  label: string;
  isActive: boolean;
}

export interface CreateProductType {
  label: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  private url = `${environment.apiUrl}/product-types`;

  constructor(private http: HttpClient) {}

  findAll(includeInactive = false): Observable<ProductType[]> {
    const url = includeInactive ? `${this.url}?includeInactive=true` : this.url;
    return this.http.get<ProductType[]>(url);
  }

  findOne(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.url}/${id}`);
  }

  create(productType: CreateProductType): Observable<ProductType> {
    return this.http.post<ProductType>(this.url, productType);
  }

  update(
    id: number,
    productType: Partial<CreateProductType>,
  ): Observable<ProductType> {
    return this.http.patch<ProductType>(`${this.url}/${id}`, productType);
  }

  setActive(id: number, isActive: boolean): Observable<ProductType> {
    return this.http.patch<ProductType>(`${this.url}/${id}`, { isActive });
  }

  remove(id: number): Observable<ProductType> {
    return this.http.delete<ProductType>(`${this.url}/${id}`);
  }
}
