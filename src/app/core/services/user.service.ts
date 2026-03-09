import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@core/models/user.model';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getUserCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/count`).pipe(
      map(res => res.count)
    );
  }


  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  fullUpdateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}/full-update`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


}
