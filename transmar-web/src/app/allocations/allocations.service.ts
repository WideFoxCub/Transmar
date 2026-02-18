import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AllocationRow } from './allocation.model';

@Injectable({ providedIn: 'root' })
export class AllocationsService {
  constructor(private http: HttpClient) { }

  getAll(productId?: number, assemblyLineId?: number): Observable<AllocationRow[]> {
    const params: string[] = [];
    if (productId) params.push(`productId=${productId}`);
    if (assemblyLineId) params.push(`assemblyLineId=${assemblyLineId}`);
    const url = params.length ? `/api/allocations?${params.join('&')}` : '/api/allocations';
    return this.http.get<AllocationRow[]>(url);
  }

  allocate(alassLineId: number, alwstationId: number): Observable<any> {
    return this.http.post('/api/allocations/allocate', { alassLineId, alwstationId });
  }

  remove(ids: number[]): Observable<void> {
    return this.http.delete<void>('/api/allocations', { body: ids });
  }
}
