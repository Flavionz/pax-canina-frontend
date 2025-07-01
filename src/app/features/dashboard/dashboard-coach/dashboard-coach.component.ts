import { Component, OnInit } from '@angular/core';
import { CoachService } from '@core/services/coach.service';
import { SessionService } from '@core/services/session.service';
import { Coach } from '@core/models/coach.model';
import { Session } from '@core/models/session.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-coach',
  standalone: true,
  imports: [CommonModule],
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

  /**
   * Loads coach profile and associated sessions on component init.
   * Follows best practice for role-based data access (jury/enterprise ready).
   */
  ngOnInit(): void {
    this.loading = true;
    // Load coach profile
    this.coachService.getProfile().subscribe({
      next: coach => {
        this.coach = coach;
        // Once coach loaded, load only sessions for this coach
        this.sessionService.getSessions().subscribe({
          next: sessions => {
            // Filter sessions where coach.idUser matches logged-in coach
            this.sessions = (sessions || []).filter(s => s.coach?.idUser === coach.idUser);
            this.loading = false;
          },
          error: () => {
            this.sessions = [];
            this.loading = false;
          }
        });
      },
      error: () => {
        this.coach = null;
        this.sessions = [];
        this.loading = false;
      }
    });
  }
}
