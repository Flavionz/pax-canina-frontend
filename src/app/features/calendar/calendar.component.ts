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

interface Session {
  id: number;
  date: string;
  title: string;
  status: 'available' | 'full';
}

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
    MatIconModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  selectedDate: Date | null = new Date();
  sessionsByDate: Record<string, Session[]> = {};
  sessions: Session[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
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
    this.http.get<Session[]>(`/api/sessions?year=${year}&month=${month}`)
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
    this.http.get<Session[]>(`/api/sessions?date=${iso}`)
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
}
