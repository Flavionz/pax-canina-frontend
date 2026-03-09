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

  sessionsByDate: Record<string, Session[]> = {};
  monthSessions: Session[] = [];
  sessions: Session[] = [];

  myDogs: Dog[] = [];

  private dialog = inject(MatDialog);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Dog[]>(`${environment.apiUrl}/dogs/me`).subscribe(dogs => {
      this.myDogs = dogs || [];
    });

    if (this.selectedDate) {
      this.loadMonth(this.selectedDate);
      this.loadDay(this.selectedDate);
    }
  }

  private toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseLocalDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }

  private adaptSession(s: any): Session {
    return {
      ...s,
      course: s.course ?? (s.courseId
        ? { idCourse: s.courseId, name: s.courseName, imageUrl: s.courseImageUrl }
        : undefined),
      coach: s.coach ?? (s.coachId
        ? { id: s.coachId, firstName: s.coachFirstName, lastName: s.coachLastName, avatarUrl: s.coachAvatarUrl }
        : undefined),
      ageGroup: s.ageGroup ?? (s.ageGroupId
        ? { idAgeGroup: s.ageGroupId, name: s.ageGroupName, minAge: s.minAge, maxAge: s.maxAge }
        : undefined),
    } as Session;
  }

  private loadMonth(d: Date) {
    const year  = d.getFullYear();
    const month = d.getMonth() + 1;
    const mm    = month.toString().padStart(2, '0');

    const lastDay = new Date(year, month, 0).getDate();
    const ddEnd   = lastDay.toString().padStart(2, '0');

    const start = `${year}-${mm}-01`;
    const end   = `${year}-${mm}-${ddEnd}`;

    this.http.get<any[]>(`${environment.apiUrl}/sessions/by-date-range?start=${start}&end=${end}`)
      .subscribe({
        next: (arr) => {
          this.sessionsByDate = {};
          this.monthSessions = (arr || [])
            .map(s => this.adaptSession(s))
            .sort((a, b) => a.date.localeCompare(b.date) ||
              (a.startTime || '').localeCompare(b.startTime || ''));

          for (const s of this.monthSessions) {
            (this.sessionsByDate[s.date] ??= []).push(s);
          }
        },
        error: (err) => {
          console.error('[Calendar] by-date-range failed:', err);
          this.sessionsByDate = {};
          this.monthSessions = [];
        }
      });
  }

  private loadDay(d: Date) {
    const iso = this.toIsoDate(d);
    this.http.get<any[]>(`${environment.apiUrl}/sessions/by-date/${iso}`)
      .subscribe(arr => {
        this.sessions = (arr || []).map(s => this.adaptSession(s));
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

  openSessionDetail(s: Session) {
    this.dialog.open(SessionDetailDialogComponent, {
      panelClass: 'pax-modal-center',
      data: { session: s, myDogs: this.myDogs },
      autoFocus: false,
      restoreFocus: false,
      width: '410px',
      maxWidth: '95vw'
    }).afterClosed().subscribe(result => {
      if (result?.success && this.selectedDate) {
        this.loadMonth(this.selectedDate);
        this.loadDay(this.selectedDate);
      }
    });
  }

  onDateChange(d: Date | null) {
    if (!(d instanceof Date)) return;
    this.selectedDate = d;
    this.loadDay(d);
  }

  jumpToSession(s: Session) {
    const target = this.parseLocalDate(s.date);
    if (!this.selectedDate || this.toIsoDate(this.selectedDate) !== s.date) {
      this.selectedDate = target;
      this.loadDay(this.selectedDate);
      setTimeout(() => this.openSessionDetail(s), 150);
    } else {
      this.openSessionDetail(s);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
  }

  isToday(dateStr: string): boolean {
    const today = new Date();
    const d = this.parseLocalDate(dateStr);
    return today.getFullYear() === d.getFullYear()
      && today.getMonth() === d.getMonth()
      && today.getDate() === d.getDate();
  }
}
