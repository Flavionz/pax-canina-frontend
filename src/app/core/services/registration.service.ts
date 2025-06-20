import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from '@models/registration.model';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private baseUrl = `${environment.apiUrl}/proprietaire/me/inscriptions`;

  constructor(private http: HttpClient) {}

  getMyRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.baseUrl);
  }

  subscribeToSession(sessionId: number): Observable<Registration> {
    return this.http.post<Registration>(`${environment.apiUrl}/session/${sessionId}/inscription`, {});
  }
}
