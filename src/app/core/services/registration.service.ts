import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from '@models/registration.model';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private baseUrl = `${environment.apiUrl}/owner/me/registrations`;

  constructor(private http: HttpClient) {}

  /** Get all registrations for the currently logged-in owner */
  getMyRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.baseUrl);
  }

  /** Register a dog to a session */
  subscribeToSession(sessionId: number, dogId: number): Observable<Registration> {
    return this.http.post<Registration>(
      `${environment.apiUrl}/sessions/${sessionId}/registration`,
      { dogId }
    );
  }
}
