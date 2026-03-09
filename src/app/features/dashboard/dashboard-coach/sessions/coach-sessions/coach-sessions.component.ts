import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionService } from '@services/session.service';
import { CoachService } from '@services/coach.service';
import { Session } from '@models/session.model';

@Component({
  standalone: true,
  selector: 'app-coach-sessions',
  imports: [CommonModule, RouterLink],
  templateUrl: './coach-sessions.component.html',
  styleUrls: ['./coach-sessions.component.scss']
})
export class CoachSessionsComponent implements OnInit {
  loading = true;
  sessions: Session[] = [];
  private coachId!: number;

  constructor(
    private sessionSvc: SessionService,
    private coachSvc: CoachService
  ) {}

  ngOnInit(): void {
    // 1) carico profilo coach
    this.coachSvc.getProfile().subscribe({
      next: coach => {
        this.coachId = coach.id!;
        // 2) carico TUTTE le sessioni e filtro client-side per il coach
        this.sessionSvc.getSessions().subscribe({
          next: all => {
            this.sessions = (all || []).filter(s => s.coach?.id === this.coachId);
            this.loading = false;
          },
          error: () => { this.sessions = []; this.loading = false; }
        });
      },
      error: () => { this.loading = false; }
    });
  }

  delete(idSession?: number): void {
    if (!idSession) return;
    if (!confirm('Supprimer cette session ?')) return;

    this.sessionSvc.delete(idSession).subscribe(() => {
      // usa idSession, non id
      this.sessions = this.sessions.filter(s => s.idSession !== idSession);
    });
  }
}
