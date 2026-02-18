import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workstation } from './workstation.model';

@Injectable({ providedIn: 'root' })
export class WorkstationsService {
  private readonly baseUrl = '/api/workstations';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Workstation[]> {
    return this.http.get<Workstation[]>(this.baseUrl);
  }

  create(ws: Omit<Workstation, 'alwstationId'>): Observable<Workstation> {
    return this.http.post<Workstation>(this.baseUrl, ws);
  }

  update(ws: Workstation): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${ws.alwstationId}`, ws);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
