import { environment } from '@environments/environment';
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  MatDatepickerModule,
  MatCalendarCellClassFunction
} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Session } from '@core/models/session.model';
import { Dog } from '@core/models/dog.model';
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

  /** Sessions indexed by day (YYYY-MM-DD) for the current month view */
  sessionsByDate: Record<string, Session[]> = {};
  /** Flat list of sessions for the month (for summary) */
  monthSessions: Session[] = [];
  /** Sessions for the currently selected date */
  sessions: Session[] = [];

  myDogs: Dog[] = [];

  private dialog = inject(MatDialog);

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Load user's dogs (used by the dialog)
    this.http.get<Dog[]>(`${environment.apiUrl}/dogs/me`).subscribe(dogs => {
      this.myDogs = dogs || [];
    });

    if (this.selectedDate) {
      this.loadMonth(this.selectedDate);
      this.loadDay(this.selectedDate);
    }
  }

  /** Format Date -> YYYY-MM-DD */
  private toIsoDate(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Map raw DTO -> Session model (kept here because this component calls HTTP directly) */
  private adaptSession(s: any): Session {
    return {
      ...s,
      course: s.course ?? (s.courseId
        ? { idCourse: s.courseId, name: s.courseName, imageUrl: s.courseImageUrl }
        : undefined),
      coach: s.coach ?? (s.coachId
        ? { id: s.coachId, firstName: s.coachFirstName, lastName: s.coachLastName, avatarUrl: s.coachAvatarUrl }
        : undefined),
      // 🔁 KEY FIX: minAge/maxAge (non più ageMin/ageMax)
      ageGroup: s.ageGroup ?? (s.ageGroupId
        ? { idAgeGroup: s.ageGroupId, name: s.ageGroupName, minAge: s.minAge, maxAge: s.maxAge }
        : undefined),
      // status already normalized server-side; keep as provided or compute if needed
    } as Session;
  }

  /** Load all sessions for the month containing 'd' */
  private loadMonth(d: Date) {
    const year = d.getFullYear(), month = d.getMonth() + 1;
    const mm = month.toString().padStart(2, '0');
    const start = `${year}-${mm}-01`;
    const end = `${year}-${mm}-31`;

    this.http.get<any[]>(`${environment.apiUrl}/sessions/by-date-range?start=${start}&end=${end}`)
      .subscribe(arr => {
        this.sessionsByDate = {};
        this.monthSessions = (arr || [])
          .map(s => this.adaptSession(s))
          .sort((a, b) => a.date.localeCompare(b.date));

        for (const s of this.monthSessions) {
          (this.sessionsByDate[s.date] ??= []).push(s);
        }
      });
  }

  /** Load all sessions for a single day */
  private loadDay(d: Date) {
    const iso = this.toIsoDate(d);
    this.http.get<any[]>(`${environment.apiUrl}/sessions/by-date/${iso}`)
      .subscribe(arr => {
        this.sessions = (arr || []).map(s => this.adaptSession(s));
        this.sessionsByDate[iso] = this.sessions;
      });
  }

  /** Calendar cell class: 'full' if all sessions that day are full, else 'available' */
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

  /** Shortcut: all sessions of current month */
  getMonthSessions(): Session[] {
    return this.monthSessions;
  }

  /** Open detail dialog for a session */
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
      // 🔁 FIX: il dialog chiude con { success: true }, non con boolean
      if (result?.success && this.selectedDate) {
        this.loadMonth(this.selectedDate);
        this.loadDay(this.selectedDate);
      }
    });
  }

  /** Handle date change from the datepicker */
  onDateChange(d: Date | null) {
    if (!(d instanceof Date)) return;
    this.selectedDate = d;
    this.loadDay(d);
  }

  /** Jump to a session date and open its dialog */
  jumpToSession(s: Session) {
    if (!this.selectedDate || this.toIsoDate(this.selectedDate) !== s.date) {
      this.selectedDate = new Date(s.date);
      this.loadDay(this.selectedDate);
      setTimeout(() => this.openSessionDetail(s), 150); // ensure day list is rendered
    } else {
      this.openSessionDetail(s);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
  }

  /** True if the session date is today */
  isToday(dateStr: string): boolean {
    const today = new Date();
    const d = new Date(dateStr);
    return today.getFullYear() === d.getFullYear()
      && today.getMonth() === d.getMonth()
      && today.getDate() === d.getDate();
  }
}
