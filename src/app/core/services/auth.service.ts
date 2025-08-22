import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

interface JwtLoginResponse {
  token: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly JWT_KEY = 'jwt';
  private readonly ROLE_KEY = 'role';

  private loggedIn = new BehaviorSubject<boolean>(false);
  /** Observable to know if the user is logged in */
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  /** Current user's role */
  private _role: string | null = null;

  /** Base URL for /auth */
  public baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    const jwt = localStorage.getItem(this.JWT_KEY);
    const storedRole = localStorage.getItem(this.ROLE_KEY);
    if (jwt && storedRole) {
      this._role = storedRole;
      this.loggedIn.next(true);
    }
  }

  public get role(): string | null {
    return this._role;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<JwtLoginResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        map((response) => {
          if (response?.token && response?.role) {
            this.setSession(response.token, response.role);
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
    localStorage.removeItem(this.JWT_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this._role = null;
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.JWT_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.JWT_KEY) && !!this._role;
  }

  /** ---------------------------
   *  Email verification
   * --------------------------- */
  verifyEmail(token: string): Observable<{ status: string } | { error: string }> {
    return this.http.get<{ status: string } | { error: string }>(
      `${this.baseUrl}/verify-email`,
      { params: { token } }
    );
  }

  resendVerification(userId: number): Observable<{ status: string } | { error: string }> {
    return this.http.post<{ status: string } | { error: string }>(
      `${this.baseUrl}/resend-verification/${userId}`,
      {}
    );
  }

  /** ---------------------------
   *  Password reset flow
   * --------------------------- */
  requestPasswordReset(email: string): Observable<{ status: string }> {
    // Backend always returns 200 OK to avoid email enumeration
    return this.http.post<{ status: string }>(`${this.baseUrl}/password-reset-request`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ status: string } | { error: string }> {
    return this.http.post<{ status: string } | { error: string }>(
      `${this.baseUrl}/password-reset`,
      { token, newPassword }
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post<void>(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }


  /** ---------------------------
   *  Internal helpers
   * --------------------------- */
  private setSession(token: string, role: string) {
    localStorage.setItem(this.JWT_KEY, token);
    localStorage.setItem(this.ROLE_KEY, role);
    this._role = role;
    this.loggedIn.next(true);
  }
}
