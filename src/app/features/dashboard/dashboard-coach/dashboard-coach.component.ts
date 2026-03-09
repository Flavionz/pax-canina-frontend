import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoachService } from '@core/services/coach.service';
import { SessionService } from '@core/services/session.service';
import { Coach } from '@core/models/coach.model';
import { Session } from '@core/models/session.model';

@Component({
  selector: 'app-dashboard-coach',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard-coach.component.html',
  styleUrls: ['./dashboard-coach.component.scss']
})
export class DashboardCoachComponent implements OnInit {
  coach: Coach | null = null;
  sessions: Session[] = [];
  loading = true;

  constructor(
    private coachService: CoachService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    // 1) Carico profilo coach
    this.coachService.getProfile().subscribe({
      next: coach => {
        this.coach = coach;

        // 2) Carico TUTTE le sessioni e filtro solo quelle del coach corrente
        this.sessionService.getSessions().subscribe({
          next: all => {
            const mine = (all || []).filter(s => s.coach?.id === coach.id);

            // Ordina per data+ora e mostra le ultime 5
            this.sessions = mine.sort((a, b) => {
              const aKey = `${a.date ?? ''} ${a.startTime ?? ''}`;
              const bKey = `${b.date ?? ''} ${b.startTime ?? ''}`;
              return aKey.localeCompare(bKey);
            }).slice(0, 5);

            this.loading = false;
          },
          error: () => { this.sessions = []; this.loading = false; }
        });
      },
      error: () => { this.coach = null; this.sessions = []; this.loading = false; }
    });
  }
}
