import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  private _role: string | null = null;

  baseUrl = environment.apiUrl;

  get role(): string | null {
    return this._role;
  }

  constructor(private http: HttpClient) {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.decodeJwt(jwt);
      this.loggedIn.next(true);
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string, role: string }>(
      `${this.baseUrl}/auth/login`,
      { email, password }
    ).pipe(
      map(response => {
        if (response && response.token) {
          this.decodeJwt(response.token);
          this._role = response.role;
          this.loggedIn.next(true);
          return true;
        }
        this.loggedIn.next(false);
        return false;
      }),
      catchError(() => {
        this.loggedIn.next(false);
        return of(false);
      })
    );
  }

  registerProprietaire(data: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/proprietaire`, data);
  }

  decodeJwt(jwt: string) {
    localStorage.setItem('jwt', jwt);
    const splitJwt = jwt.split('.');
    if (splitJwt.length !== 3) return;
    try {
      const jwtBody = splitJwt[1];
      const jsonBody = atob(jwtBody);
      const body = JSON.parse(jsonBody);
      this._role = body.role;
      this.loggedIn.next(true);
    } catch (e) {
      this._role = null;
      this.loggedIn.next(false);
    }
  }

  logout() {
    localStorage.removeItem('jwt');
    this._role = null;
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    return this.loggedIn.value;
  }
}
