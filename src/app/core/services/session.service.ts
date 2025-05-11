import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessions: Session[] = [
    { id: 1, date: '2025-05-12', title: 'Lezione di gruppo', status: 'available' },
    { id: 2, date: '2025-05-12', title: 'Lezione individuale', status: 'full' },
    { id: 3, date: '2025-05-13', title: 'Puppy class', status: 'available' },
    { id: 4, date: '2025-05-15', title: 'Socializzazione', status: 'full' }
    // aggiungi altre simulazioni se vuoi!
  ];

  getSessionsByMonth(year: number, month: number): Observable<Session[]> {
    const monthStr = month.toString().padStart(2, '0');
    return of(
      this.sessions.filter(s => s.date.startsWith(`${year}-${monthStr}`))
    );
  }

  getSessionsByDate(date: string): Observable<Session[]> {
    return of(
      this.sessions.filter(s => s.date === date)
    );
  }
}
