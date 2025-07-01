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
import { FormsModule } from '@angular/forms'; // Needed for ngModel

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
  sessionsByDate: Record<string, Session[]> = {};
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
    this.dogService.getMyDogs().subscribe(dogs => {
      this.myDogs = dogs;
      if (dogs.length === 1) this.selectedDogId = dogs[0].idDog!;
    });
    if (this.selectedDate) {
      this.loadMonth(this.selectedDate);
      this.loadDay(this.selectedDate);
    }
  }

  onMonthChange(payload: unknown) {
    const d = payload instanceof Date ? payload : (payload as any)?.value;
    if (d instanceof Date) this.loadMonth(d);
  }

  private loadMonth(d: Date) {
    const year = d.getFullYear(), month = d.getMonth() + 1;
    this.http.get<Session[]>(`/api/session/by-date-range?start=${year}-${String(month).padStart(2,'0')}-01&end=${year}-${String(month).padStart(2,'0')}-31`)
      .subscribe(arr => {
        this.sessionsByDate = {};
        for (let s of arr) {
          (this.sessionsByDate[s.date] ??= []).push(s);
        }
      });
  }

  onDateChange(d: Date | null) {
    if (!(d instanceof Date)) return;
    this.selectedDate = d;
    this.loadDay(d);
  }

  private loadDay(d: Date) {
    const iso = d.toISOString().substring(0,10);
    this.http.get<Session[]>(`/api/session/by-date/${iso}`)
      .subscribe(arr => this.sessions = arr);
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const key = cellDate.toISOString().substring(0,10);
      const day = this.sessionsByDate[key] || [];
      if (day.length) return day.every(s=>s.status==='full') ? 'full' : 'available';
    }
    return '';
  }

  get sessionsForSelectedDate(): Session[] {
    if (!this.selectedDate) return [];
    return this.sessionsByDate[this.selectedDate.toISOString().substring(0,10)] || [];
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

    // Check dog selection
    if (!this.selectedDogId) {
      this.enrollError = "Veuillez sélectionner un chien à inscrire.";
      this.enrolling = false;
      return;
    }
    // Check session and idSession
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
