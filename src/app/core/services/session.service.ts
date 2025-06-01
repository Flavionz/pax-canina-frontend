import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '@models/session.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private baseUrl = `${environment.apiUrl}/sessions`;

  constructor(private http: HttpClient) {}

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.baseUrl);
  }

  getSessionsByMonth(year: number, month: number): Observable<Session[]> {
    // Esempio di endpoint che accetta query params (modifica se necessario)
    const params = { year: year.toString(), month: month.toString().padStart(2, '0') };
    return this.http.get<Session[]>(this.baseUrl, { params });
  }

  getSessionsByDate(date: string): Observable<Session[]> {
    // Se il backend ha endpoint dedicato, altrimenti filtra lato frontend
    return this.http.get<Session[]>(`${this.baseUrl}/by-date/${date}`);
  }

}
