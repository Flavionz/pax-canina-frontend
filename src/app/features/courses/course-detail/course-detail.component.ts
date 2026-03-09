import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '@core/services/course.service';
import { SessionService } from '@core/services/session.service';
import { Course } from '@models/course.model';
import { Session } from '@models/session.model';
import { catchError, forkJoin, of, takeUntil, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SessionDetailDialogComponent } from '../../calendar/session-detail-dialog/session-detail-dialog.component';
import { Dog } from '@core/models/dog.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  // DI
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly sessionService = inject(SessionService);
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();

  // State
  course: Course | null = null;
  sessions: Session[] = [];
  loading = true;
  error = false;

  // cani utente (abilita “Réserver” e popola il dialog)
  myDogs: Dog[] = [];

  ngOnInit(): void {
    // carica cani utente
    this.http.get<Dog[]>(`${environment.apiUrl}/dogs/me`).subscribe(d => this.myDogs = d || []);

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
        catchError(err => { console.error('Error loading course:', err); return of(null); })
      ),
      sessions: this.sessionService.getByCourse(courseId).pipe(
        catchError(err => { console.error('Error loading sessions:', err); return of([]); })
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
    // ordinamento robusto per ISO string + orario
    return (sessions || []).sort(
      (a, b) => a.date.localeCompare(b.date) ||
        (a.startTime || '').localeCompare(b.startTime || '')
    );
  }

  // Stats
  getTotalCapacity(): number {
    return this.sessions.reduce((sum, s) => sum + (s.maxCapacity || 0), 0);
  }
  getAvailablePlaces(): number {
    return this.sessions.reduce((sum, s) => {
      const free = Math.max(0, (s.maxCapacity || 0) - (s.registrationsCount || 0));
      return sum + free;
    }, 0);
  }
  getOccupancyRate(): number {
    const total = this.getTotalCapacity();
    const avail = this.getAvailablePlaces();
    return total > 0 ? Math.round(((total - avail) / total) * 100) : 0;
  }

  isSessionFull(s: Session): boolean {
    return (s.registrationsCount || 0) >= (s.maxCapacity || 0);
  }
  getSessionAvailability(s: Session): string {
    const available = Math.max(0, (s.maxCapacity || 0) - (s.registrationsCount || 0));
    if (available === 0) return 'Complet';
    if (available === 1) return '1 place disponible';
    return `${available} places disponibles`;
  }

  // Dialog iscrizione (stessa UX del calendario)
  openSessionDetail(s: Session) {
    if (this.isSessionFull(s)) return;
    this.dialog.open(SessionDetailDialogComponent, {
      panelClass: 'pax-modal-center',
      data: { session: s, myDogs: this.myDogs },
      autoFocus: false,
      restoreFocus: false,
      width: '410px',
      maxWidth: '95vw'
    }).afterClosed().subscribe(res => {
      if (res?.success && this.course?.idCourse) {
        this.loadCourseData(this.course.idCourse);
      }
    });
  }

  // TrackBy
  trackBySessionId = (i: number, s: Session) => s.idSession ?? `session-${i}`;
}
