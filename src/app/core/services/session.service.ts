// src/app/core/services/session.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '@core/models/session.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Nota: l’endpoint REST lato Spring sarà /api/session
  private baseUrl = `${environment.apiUrl}/session`;

  constructor(private http: HttpClient) {}

  /** Tutte le sessioni disponibili */
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}`);
  }

  /** Tutte le sessioni relative a un dato corso */
  getByCourse(courseId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/by-course/${courseId}`);
  }

  /**
   * (Opzionale) Filtra le sessioni per data,
   * se hai già un endpoint dedicato: GET /api/session/by-date/{date}
   */
  getByDate(date: string): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/by-date/${date}`);
  }

  /**
   * (Opzionale) Recupera le sessioni di un mese specifico:
   * Puoi implementarlo sia con query param lato backend
   * che filtrarlo qui in client.
   */
  getByMonth(year: number, month: number): Observable<Session[]> {
    const params = {
      year: year.toString(),
      month: month.toString().padStart(2, '0')
    };
    return this.http.get<Session[]>(`${this.baseUrl}/by-month`, { params });
  }
}
