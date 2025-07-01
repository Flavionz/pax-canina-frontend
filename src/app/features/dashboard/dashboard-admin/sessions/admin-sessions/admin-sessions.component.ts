import { Component, OnInit } from '@angular/core';
import { SessionService } from '@core/services/session.service';
import { CourseService } from '@core/services/course.service';
import { Session } from '@core/models/session.model';
import { Course } from '@core/models/course.model';
import { SessionFormComponent } from '../session-form/session-form.component';
import { CommonModule, NgClass } from '@angular/common';

/**
 * Admin sessions management component.
 * Handles display, creation, edit and delete of training sessions.
 */
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
  formOpen = false;
  selectedSession: Session | null = null;

  constructor(
    private sessionService: SessionService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.loadCourses();
  }

  /** Loads all sessions from the API. */
  loadSessions(): void {
    this.sessionService.getSessions().subscribe({
      next: res => this.sessions = res,
      error: () => this.sessions = []
    });
  }

  /** Loads all courses for session association. */
  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: res => this.courses = res,
      error: () => this.courses = []
    });
  }

  /** Opens the session form for creation. */
  openForm(): void {
    this.selectedSession = null;
    this.formOpen = true;
  }

  /** Opens the session form for editing. */
  editSession(session: Session): void {
    this.selectedSession = session;
    this.formOpen = true;
  }

  /**
   * Closes the form modal.
   * Accepts an optional boolean flag to reload the sessions list after close.
   */
  closeForm(refresh?: boolean): void {
    this.formOpen = false;
    if (refresh) this.loadSessions();
  }

  /** Deletes a session by ID (admin/coach only). */
  deleteSession(id: number | undefined): void {
    if (!id) return;
    if (confirm('Supprimer cette session ?')) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => this.loadSessions(),
        error: () => alert("Erreur lors de la suppression de la session.")
      });
    }
  }

  /** Handles session save from the form (create or update). */
  handleSave(session: Session): void {
    if (session.idSession) {
      // Update existing session
      this.sessionService.updateSession(session.idSession, session).subscribe({
        next: () => this.closeForm(true),
        error: () => alert("Erreur lors de la modification de la session.")
      });
    } else {
      // Create new session
      this.sessionService.createSession(session).subscribe({
        next: () => this.closeForm(true),
        error: () => alert("Erreur lors de la création de la session.")
      });
    }
  }
}
