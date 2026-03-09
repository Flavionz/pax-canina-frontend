import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Specialization } from '@models/specialization.model';

@Injectable({ providedIn: 'root' })
export class SpecializationService {
  private apiUrl = `${environment.apiUrl}/specialization`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(this.apiUrl);
  }

  create(s: Partial<Specialization>): Observable<Specialization> {
    return this.http.post<Specialization>(this.apiUrl, s);
  }

  update(id: number, s: Partial<Specialization>): Observable<Specialization> {
    return this.http.put<Specialization>(`${this.apiUrl}/${id}`, s);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSpecializations(): Observable<Specialization[]> {
    return this.getAll();
  }
}
