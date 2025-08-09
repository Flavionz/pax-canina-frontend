import { environment } from '@environments/environment';
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  MatDatepickerModule,
  MatCalendarCellClassFunction
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Session } from '@core/models/session.model';
import { Dog } from '@core/models/dog.model';
import { RegistrationService } from '@core/services/registration.service';
import { DogService } from '@core/services/dog.service';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SessionDetailDialogComponent } from './session-detail-dialog/session-detail-dialog.component';

@Component({
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ],
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  selectedDate: Date | null = new Date();

  // Tutte le sessioni del mese, indicizzate per data (YYYY-MM-DD)
  sessionsByDate: Record<string, Session[]> = {};
  // Tutte le sessioni del mese in array flat (per il summary)
  monthSessions: Session[] = [];
  // Sessioni del giorno selezionato
  sessions: Session[] = [];

  myDogs: Dog[] = [];

  private dialog = inject(MatDialog);

  constructor(
    private http: HttpClient,
    private registrationService: RegistrationService,
    private dogService: DogService
  ) {}

  ngOnInit() {
    // Carica i cani dell'utente
    this.dogService.getMyDogs().subscribe(dogs => {
      this.myDogs = dogs;
    });

    if (this.selectedDate) {
      this.loadMonth(this.selectedDate);
      this.loadDay(this.selectedDate);
    }
  }

  /** YYYY-MM-DD locale */
  private toIsoDate(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private adaptSession(s: any): Session {
    return {
      ...s,
      course: s.course ?? (s.courseId ? { idCourse: s.courseId, name: s.courseName, imageUrl: s.courseImageUrl } : undefined),
      coach: s.coach ?? (s.coachId ? { id: s.coachId, firstName: s.coachFirstName, lastName: s.coachLastName, avatarUrl: s.coachAvatarUrl } : undefined),
      ageGroup: s.ageGroup ?? (s.ageGroupId ? { idAgeGroup: s.ageGroupId, name: s.ageGroupName, ageMin: s.minAge, ageMax: s.maxAge } : undefined),
    };
  }

  /** Carica tutte le sessioni del mese */
  private loadMonth(d: Date) {
    const year = d.getFullYear(), month = d.getMonth() + 1;
    const start = `${year}-${month.toString().padStart(2, '0')}-01`;
    const end = `${year}-${month.toString().padStart(2, '0')}-31`;

    this.http.get<any[]>(`${environment.apiUrl}/sessions/by-date-range?start=${start}&end=${end}`)
      .subscribe(arr => {
        this.sessionsByDate = {};
        this.monthSessions = arr.map(s => this.adaptSession(s)).sort((a, b) => a.date.localeCompare(b.date));
        for (let s of this.monthSessions) {
          (this.sessionsByDate[s.date] ??= []).push(s);
        }
      });
  }

  /** Carica tutte le sessioni di uno specifico giorno */
  private loadDay(d: Date) {
    const iso = this.toIsoDate(d);
    this.http.get<any[]>(`${environment.apiUrl}/sessions/by-date/${iso}`)
      .subscribe(arr => {
        this.sessions = arr.map(s => this.adaptSession(s));
        this.sessionsByDate[iso] = this.sessions;
      });
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const key = this.toIsoDate(cellDate);
      const day = this.sessionsByDate[key] || [];
      if (day.length) return day.every(s => s.status === 'full') ? 'full' : 'available';
    }
    return '';
  }

  get sessionsForSelectedDate(): Session[] {
    return this.sessions;
  }

  /** Shortcut: sessioni del mese */
  getMonthSessions(): Session[] {
    return this.monthSessions;
  }

  // === APERTURA DIALOG ===
  openSessionDetail(s: Session) {
    this.dialog.open(SessionDetailDialogComponent, {
      panelClass: 'pax-modal-center',
      data: {
        session: s,
        myDogs: this.myDogs
      },
      autoFocus: false,
      restoreFocus: false,
      width: '410px',
      maxWidth: '95vw'
    }).afterClosed().subscribe(result => {
      // Se result === true vuol dire che l'iscrizione è andata a buon fine, quindi ricarica dati
      if (result === true && this.selectedDate) {
        this.loadMonth(this.selectedDate);
        this.loadDay(this.selectedDate);
      }
    });
  }

  /** Handler cambio data */
  onDateChange(d: Date | null) {
    if (!(d instanceof Date)) return;
    this.selectedDate = d;
    this.loadDay(d);
  }

  /** Shortcut click: seleziona la data e apre il dettaglio */
  jumpToSession(s: Session) {
    if (!this.selectedDate || this.toIsoDate(this.selectedDate) !== s.date) {
      this.selectedDate = new Date(s.date);
      this.loadDay(this.selectedDate);
      setTimeout(() => this.openSessionDetail(s), 150); // Garantisce il refresh
    } else {
      this.openSessionDetail(s);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
  }

  /** True se la data della session è oggi */
  isToday(dateStr: string): boolean {
    const today = new Date();
    const d = new Date(dateStr);
    return today.getFullYear() === d.getFullYear()
      && today.getMonth() === d.getMonth()
      && today.getDate() === d.getDate();
  }
}
