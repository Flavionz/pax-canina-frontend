import { environment } from '@environments/environment';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    MatButton,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  selectedDate: Date | null = new Date();

  // All sessions indexed by date (YYYY-MM-DD)
  sessionsByDate: Record<string, Session[]> = {};

  // Sessions for the selected day
  sessions: Session[] = [];

  selectedSession: Session | null = null;

  myDogs: Dog[] = [];
  selectedDogId: number | null = null;
  enrolling = false;
  enrollError: string | null = null;
  enrollSuccess = false;

  constructor(
    private http: HttpClient,
    private registrationService: RegistrationService,
    private dogService: DogService
  ) {}

  ngOnInit() {
    // Fetch user's dogs
    this.dogService.getMyDogs().subscribe(dogs => {
      this.myDogs = dogs;
      if (dogs.length === 1) this.selectedDogId = dogs[0].idDog!;
    });

    if (this.selectedDate) {
      this.loadMonth(this.selectedDate); // Sessions for month (calendar dots)
      this.loadDay(this.selectedDate);   // Sessions for the selected day
    }
  }

  onMonthChange(payload: unknown) {
    const d = payload instanceof Date ? payload : (payload as any)?.value;
    if (d instanceof Date) this.loadMonth(d);
  }

  /** Helper: always returns YYYY-MM-DD in local time (NON toISOString!) */
  private toIsoDate(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Adapter: ensures relational fields are always available (even if flat DTO) */
  private adaptSession(s: any): Session {
    return {
      ...s,
      course: s.course ?? (s.courseId ? { idCourse: s.courseId, name: s.courseName, imageUrl: s.courseImageUrl } : undefined),
      coach: s.coach ?? (s.coachId ? { id: s.coachId, firstName: s.coachFirstName, lastName: s.coachLastName, avatarUrl: s.coachAvatarUrl } : undefined),
      ageGroup: s.ageGroup ?? (s.ageGroupId ? { idAgeGroup: s.ageGroupId, name: s.ageGroupName, ageMin: s.minAge, ageMax: s.maxAge } : undefined),
    };
  }

  /** Carica tutte le sessioni del mese (dots nel calendario) */
  private loadMonth(d: Date) {
    const year = d.getFullYear(), month = d.getMonth() + 1;
    const start = `${year}-${month.toString().padStart(2,'0')}-01`;
    const end = `${year}-${month.toString().padStart(2,'0')}-31`;

    this.http.get<any[]>(
      `${environment.apiUrl}/sessions/by-date-range?start=${start}&end=${end}`
    ).subscribe(arr => {
      this.sessionsByDate = {};
      for (let s of arr.map(s => this.adaptSession(s))) {
        (this.sessionsByDate[s.date] ??= []).push(s);
      }
    });
  }

  onDateChange(d: Date | null) {
    if (!(d instanceof Date)) return;
    this.selectedDate = d;
    this.loadDay(d);
  }

  /** Carica tutte le sessioni di uno specifico giorno */
  private loadDay(d: Date) {
    const iso = this.toIsoDate(d);
    this.http.get<any[]>(
      `${environment.apiUrl}/sessions/by-date/${iso}`
    ).subscribe(arr => {
      this.sessions = arr.map(s => this.adaptSession(s));
      this.sessionsByDate[iso] = this.sessions;
    });
  }

  /** Evidenzia le celle nel calendario */
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const key = this.toIsoDate(cellDate);
      const day = this.sessionsByDate[key] || [];
      if (day.length) return day.every(s=>s.status==='full') ? 'full' : 'available';
    }
    return '';
  }

  get sessionsForSelectedDate(): Session[] {
    return this.sessions;
  }

  openSessionDetail(s: Session) {
    this.selectedSession = s;
    this.enrollError = null;
    this.enrollSuccess = false;
    if (this.myDogs.length === 1) this.selectedDogId = this.myDogs[0].idDog!;
    else this.selectedDogId = null;
  }

  closeDetail() { this.selectedSession = null; }

  enrollToSession() {
    this.enrollError = null;
    this.enrollSuccess = false;
    this.enrolling = true;

    if (!this.selectedDogId) {
      this.enrollError = "Veuillez sélectionner un chien à inscrire.";
      this.enrolling = false;
      return;
    }
    if (!this.selectedSession || typeof this.selectedSession.idSession !== 'number') {
      this.enrollError = "Sélection de session invalide.";
      this.enrolling = false;
      return;
    }
    this.registrationService.subscribeToSession(this.selectedSession.idSession, this.selectedDogId)
      .subscribe({
        next: () => {
          this.enrollSuccess = true;
          this.enrolling = false;
          this.loadMonth(this.selectedDate!);
          this.loadDay(this.selectedDate!);
          setTimeout(() => { this.closeDetail(); }, 1500);
        },
        error: (err) => {
          this.enrolling = false;
          this.enrollError = err?.error?.message || "Erreur lors de l'inscription à la session.";
        }
      });
  }
}
