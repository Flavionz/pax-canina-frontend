import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Session {
  date: Date;
  title: string;
  status: 'available' | 'full';
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  selectedDate: Date = new Date();

  sessions: Session[] = [
    { date: new Date(2025, 4, 10), title: 'Puppy Class', status: 'available' },
    { date: new Date(2025, 4, 14), title: 'Agility Base', status: 'full' },
  ];

  get sessionsForSelectedDate(): Session[] {
    return this.sessions.filter(s =>
      s.date.getFullYear() === this.selectedDate.getFullYear() &&
      s.date.getMonth() === this.selectedDate.getMonth() &&
      s.date.getDate() === this.selectedDate.getDate()
    );
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
  }
}
