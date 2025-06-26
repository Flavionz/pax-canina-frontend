// src/app/features/dashboard/dashboard-admin/sessions/admin-sessions/admin-sessions.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService } from '@core/services/session.service';
import { CourseService } from '@core/services/course.service';
import { Session } from '@core/models/session.model';
import { Course } from '@core/models/course.model';
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
  formOpen = false;
  selectedSession: Session | null = null;

  constructor(
    private sessionService: SessionService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadSessions();
    this.loadCourses();
  }

  loadSessions() {
    this.sessionService.getSessions().subscribe({
      next: res => this.sessions = res,
      error: () => this.sessions = []
    });
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: res => this.courses = res,
      error: () => this.courses = []
    });
  }

  openForm() {
    this.selectedSession = null;
    this.formOpen = true;
  }

  editSession(session: Session) {
    this.selectedSession = session;
    this.formOpen = true;
  }

  closeForm(refresh: boolean = false) {
    this.formOpen = false;
    if (refresh) this.loadSessions();
  }

  deleteSession(id: number) {
    if (confirm('Supprimer cette session ?')) {
      // Aggiungi qui sessionService.delete quando sarà pronta l'API!
      // this.sessionService.deleteSession(id).subscribe(() => this.loadSessions());
      alert('(Fake) Session supprimée!');
      this.loadSessions();
    }
  }

  handleSave(session: Session) {
    this.closeForm(true);
  }
}
