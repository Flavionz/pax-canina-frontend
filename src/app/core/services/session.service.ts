import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '@core/models/session.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Base REST endpoint for sessions
  private baseUrl = `${environment.apiUrl}/session`;

  constructor(private http: HttpClient) {}

  /** Fetch all sessions */
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}`);
  }

  /** Fetch sessions by course ID */
  getByCourse(courseId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/by-course/${courseId}`);
  }

  /** Fetch sessions for a specific date (ISO yyyy-MM-dd) */
  getByDate(date: string): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/by-date/${date}`);
  }

  /** Fetch sessions for a specific month */
  getByMonth(year: number, month: number): Observable<Session[]> {
    const params = {
      year: year.toString(),
      month: month.toString().padStart(2, '0')
    };
    return this.http.get<Session[]>(`${this.baseUrl}/by-month`, { params });
  }

  // === CRUD Operations ===

  /** Create a new session */
  createSession(session: Session): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}`, session);
  }

  /** Update an existing session */
  updateSession(idSession: number, session: Session): Observable<Session> {
    return this.http.put<Session>(`${this.baseUrl}/${idSession}`, session);
  }

  /** Delete a session by its ID */
  deleteSession(idSession: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idSession}`);
  }

  /** (Optional) Fetch a single session by its ID */
  getSessionById(idSession: number): Observable<Session> {
    return this.http.get<Session>(`${this.baseUrl}/${idSession}`);
  }
}
