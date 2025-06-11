import { Component, OnInit } from '@angular/core';
import { SessionService } from '@services/session.service';
import { AuthService } from '@services/auth.service';
import { Session } from '@models/session.model';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-coach',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-coach.component.html',
  styleUrl: './dashboard-coach.component.scss'
})
export class DashboardCoachComponent implements OnInit {
  sessions: Session[] = [];
  coachName: string = '';
  loading = true;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    // Ottieni nome coach dal tuo AuthService o user service!
    this.coachName = this.authService.isAuthenticated() ? 'Coach' : '';
    // Filtro sessioni dove coach = utente loggato
    this.sessionService.getSessions().subscribe(sessions => {
      // Qui simulo il filtro, adatta con vero ID coach:
      // Supponiamo che l'AuthService abbia un metodo per restituire id utente loggato
      // Filtra sessioni in cui coach.idUtilisateur == idLoggato
      // const idCoach = this.authService.getUserId();
      // this.sessions = sessions.filter(s => s.coach?.idUtilisateur === idCoach);
      this.sessions = sessions || [];
      this.loading = false;
    });
  }
}
