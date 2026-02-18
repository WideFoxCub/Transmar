import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssemblyLine } from './line.model';

@Injectable({ providedIn: 'root' })
export class LinesService {
  private readonly baseUrl = '/api/assemblylines';

  constructor(private http: HttpClient) { }

  getAll(productId?: number): Observable<AssemblyLine[]> {
    const url = productId ? `${this.baseUrl}?productId=${productId}` : this.baseUrl;
    return this.http.get<AssemblyLine[]>(url);
  }

  create(line: Omit<AssemblyLine, 'alassLineId'>): Observable<AssemblyLine> {
    return this.http.post<AssemblyLine>(this.baseUrl, line);
  }

  update(line: AssemblyLine): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${line.alassLineId}`, line);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
