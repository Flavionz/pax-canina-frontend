import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  /** Observable to know if the user is logged in */
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  /** Current user's role */
  private _role: string | null = null;

  /** Base URL for /auth */
  public baseUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {
    const jwt = localStorage.getItem('jwt');
    const storedRole = localStorage.getItem('role');
    if (jwt && storedRole) {
      this._role = storedRole;
      this.loggedIn.next(true);
    }
  }

  public get role(): string | null {
    return this._role;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string; role: string }>(
      `${this.baseUrl}/login`,
      { email, password }
    ).pipe(
      map(response => {
        if (response.token && response.role) {
          localStorage.setItem('jwt', response.token);
          localStorage.setItem('role', response.role);
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

  registerOwner(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/owner`, data);
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    this._role = null;
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt') && !!this._role;
  }
}
