import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '@core/services/course.service';
import { SessionService } from '@core/services/session.service';
import { Course } from '@models/course.model';
import { Session } from '@models/session.model';
import { catchError, forkJoin, of, takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  // Dependency Injection con inject() (Angular 14+)
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly sessionService = inject(SessionService);
  private readonly destroy$ = new Subject<void>();

  // Properties tradizionali
  course: Course | null = null;
  sessions: Session[] = [];
  loading = true;
  error = false;

  ngOnInit(): void {
    const courseId = this.getCourseIdFromRoute();
    if (!courseId) {
      this.handleInvalidRoute();
      return;
    }

    this.loadCourseData(courseId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Metodi privati per una migliore organizzazione
  private getCourseIdFromRoute(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    const parsedId = Number(id);
    return !isNaN(parsedId) && parsedId > 0 ? parsedId : null;
  }

  private handleInvalidRoute(): void {
    this.error = true;
    this.loading = false;
  }

  private loadCourseData(courseId: number): void {
    this.loading = true;
    this.error = false;

    forkJoin({
      course: this.courseService.getCourseById(courseId).pipe(
        catchError(error => {
          console.error('Error loading course:', error);
          return of(null);
        })
      ),
      sessions: this.sessionService.getByCourse(courseId).pipe(
        catchError(error => {
          console.error('Error loading sessions:', error);
          return of([]);
        })
      )
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ course, sessions }) => {
          this.course = course;
          this.sessions = this.sortSessionsByDate(sessions || []);
          this.error = !course;
          this.loading = false;
        },
        error: (error) => {
          console.error('Unexpected error loading course data:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  private sortSessionsByDate(sessions: Session[]): Session[] {
    return sessions.sort((a, b) => {
      // Gestione più robusta del sorting delle date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      // Se le date sono uguali, ordina per ora di inizio (con controllo null safety)
      const startTimeA = a.startTime || '';
      const startTimeB = b.startTime || '';
      return startTimeA.localeCompare(startTimeB);
    });
  }

  // Metodi pubblici per le statistiche
  getTotalCapacity(): number {
    return this.sessions.reduce((total, session) => total + (session.maxCapacity || 0), 0);
  }

  getAvailablePlaces(): number {
    return this.sessions.reduce((total, session) => {
      const registered = session.registrationsCount || 0;
      const capacity = session.maxCapacity || 0;
      return total + Math.max(0, capacity - registered);
    }, 0);
  }

  getOccupancyRate(): number {
    const total = this.getTotalCapacity();
    const available = this.getAvailablePlaces();
    return total > 0 ? Math.round(((total - available) / total) * 100) : 0;
  }

  // Utility methods per il template
  isSessionFull(session: Session): boolean {
    const registered = session.registrationsCount || 0;
    const capacity = session.maxCapacity || 0;
    return registered >= capacity;
  }

  getSessionAvailability(session: Session): string {
    const registered = session.registrationsCount || 0;
    const capacity = session.maxCapacity || 0;
    const available = Math.max(0, capacity - registered);

    if (available === 0) return 'Complet';
    if (available === 1) return '1 place disponible';
    return `${available} places disponibles`;
  }

  // Track by function per *ngFor performance - CORRETTO per usare idSession
  trackBySessionId = (index: number, session: Session): number | string => {
    return session.idSession || `session-${index}`;
  };
}
