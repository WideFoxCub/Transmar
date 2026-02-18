import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly baseUrl = '/api/products';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  create(input: { name: string; active: boolean }): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, input);
  }

  update(p: Product): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${p.productId}`, p);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
