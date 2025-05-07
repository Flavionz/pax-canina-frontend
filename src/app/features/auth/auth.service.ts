import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  login() {
    // Qui in futuro chiamerai l'API Spring per il login
    this.loggedIn.next(true);
  }

  logout() {
    // Qui in futuro chiamerai l'API Spring per il logout o cancellerai il token
    this.loggedIn.next(false);
  }

  // In futuro aggiungerai metodi per gestire il token, ruoli, ecc.
}
