import { Component, OnInit } from '@angular/core';
import { SessionService } from '@core/services/session.service';
import { CourseService } from '@core/services/course.service';
import { AgeGroupService } from '@core/services/age-group.service';
import { CoachService } from '@core/services/coach.service';
import { Session } from '@core/models/session.model';
import { Course } from '@core/models/course.model';
import { AgeGroup } from '@core/models/age-group.model';
import { Coach } from '@core/models/coach.model';
import { SessionFormComponent } from '../session-form/session-form.component';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-sessions',
  standalone: true,
  templateUrl: './admin-sessions.component.html',
  styleUrls: ['./admin-sessions.component.scss'],
  imports: [CommonModule, NgClass, SessionFormComponent]
})
export class AdminSessionsComponent implements OnInit {
  sessions: Session[] = [];
  courses: Course[] = [];
  ageGroups: AgeGroup[] = [];
  coaches: Coach[] = [];
  formOpen = false;
  selectedSession: Session | null = null;

  constructor(
    private sessionService: SessionService,
    private courseService: CourseService,
    private ageGroupService: AgeGroupService,
    private coachService: CoachService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.loadCourses();
    this.loadAgeGroups();
    this.loadCoaches();
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe({
      next: res => this.sessions = res,
      error: () => this.sessions = []
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: res => this.courses = res,
      error: () => this.courses = []
    });
  }

  loadAgeGroups(): void {
    this.ageGroupService.getAgeGroups().subscribe({
      next: res => this.ageGroups = res,
      error: () => this.ageGroups = []
    });
  }

  loadCoaches(): void {
    this.coachService.getCoaches().subscribe({
      next: res => this.coaches = res,
      error: () => this.coaches = []
    });
  }

  openForm(): void {
    this.selectedSession = null;
    this.formOpen = true;
  }

  editSession(session: Session): void {
    this.selectedSession = session;
    this.formOpen = true;
  }

  closeForm(refresh?: boolean): void {
    this.formOpen = false;
    if (refresh) this.loadSessions();
  }

  deleteSession(id: number | undefined): void {
    if (!id) return;
    if (confirm('Supprimer cette session ?')) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => this.loadSessions(),
        error: () => alert("Erreur lors de la suppression de la session.")
      });
    }
  }

  /** Mapping Session to DTO for backend */
  private mapSessionToDto(session: Session): any {
    return {
      idSession: session.idSession,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      level: session.level,
      maxCapacity: session.maxCapacity,
      location: session.location,
      imageUrl: session.imageUrl,
      description: session.description,
      courseId: session.course?.idCourse ?? null,
      coachId: session.coach?.id ?? null,
      ageGroupId: session.ageGroup?.idAgeGroup ?? null
    };
  }

  handleSave(session: Session): void {
    const dto = this.mapSessionToDto(session);
    if (session.idSession) {
      this.sessionService.updateSession(session.idSession, dto).subscribe({
        next: () => this.closeForm(true),
        error: () => alert("Erreur lors de la modification de la session.")
      });
    } else {
      this.sessionService.createSession(dto).subscribe({
        next: () => this.closeForm(true),
        error: () => alert("Erreur lors de la création de la session.")
      });
    }
  }
}
