import { Component, OnInit } from '@angular/core';
import { SessionService } from '@core/services/session.service';
import { CourseService } from '@core/services/course.service';
import { AgeGroupService } from '@core/services/age-group.service';
import { UserService } from '@core/services/user.service';
import { Session } from '@core/models/session.model';
import { Course } from '@core/models/course.model';
import { AgeGroup } from '@core/models/age-group.model';
import { User } from '@core/models/user.model';
import { SessionFormComponent } from '../session-form/session-form.component';
import { CommonModule, NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-sessions',
  standalone: true,
  templateUrl: './admin-sessions.component.html',
  styleUrls: ['./admin-sessions.component.scss'],
  imports: [CommonModule, NgClass, SessionFormComponent, DatePipe]
})
export class AdminSessionsComponent implements OnInit {
  sessions: Session[] = [];
  courses: Course[] = [];
  ageGroups: AgeGroup[] = [];
  allUsers: User[] = [];
  filteredCoaches: User[] = [];
  formOpen = false;
  selectedSession: Session | null = null;
  selectedCourseId: number | null = null;

  constructor(
    private sessionService: SessionService,
    private courseService: CourseService,
    private ageGroupService: AgeGroupService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.loadCourses();
    this.loadAgeGroups();
    this.loadUsers();
  }

  // 🟢 FUNZIONE FIX DATA
  asDate(dateStr?: string): Date | null {
    if (!dateStr) return null;
    // Gestisce sia ISO "2025-08-15" che eventuale "2025-08-15T00:00:00"
    return new Date(dateStr.length > 10 ? dateStr : dateStr + 'T00:00:00');
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe({
      next: res => (this.sessions = res),
      error: () => (this.sessions = [])
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: res => (this.courses = res),
      error: () => (this.courses = [])
    });
  }

  loadAgeGroups(): void {
    this.ageGroupService.getAgeGroups().subscribe({
      next: res => (this.ageGroups = res),
      error: () => (this.ageGroups = [])
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.allUsers = users;
        this.filteredCoaches = this.filterCoaches();
      },
      error: () => (this.allUsers = [])
    });
  }

  filterCoaches(): User[] {
    const admins = this.allUsers.filter(u => u.role === 'ADMIN');
    let coaches: User[] = [];
    if (this.selectedCourseId && this.courses.length) {
      const course = this.courses.find(c => c.idCourse === this.selectedCourseId);
      const courseSpecIds = course?.specializations ?? [];
      coaches = this.allUsers.filter(
        u =>
          u.role === 'COACH' &&
          u.specializations?.some(specId => courseSpecIds.includes(specId))
      );
    } else {
      coaches = this.allUsers.filter(u => u.role === 'COACH');
    }
    const all = [...admins, ...coaches];
    return all.filter((user, i, arr) => arr.findIndex(u => u.id === user.id) === i);
  }

  openForm(): void {
    this.selectedSession = null;
    this.formOpen = true;
    this.selectedCourseId = null;
    this.filteredCoaches = this.filterCoaches();
  }

  editSession(session: Session): void {
    this.selectedSession = session;
    this.selectedCourseId = session.course?.idCourse ?? null;
    this.filteredCoaches = this.filterCoaches();
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

  onCourseSelected(courseId: number): void {
    this.selectedCourseId = courseId;
    this.filteredCoaches = this.filterCoaches();
  }

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
      course: session.course,
      coach: session.coach,
      ageGroup: session.ageGroup
    };
  }

  handleSave(session: Session): void {
    if (session.idSession) {
      this.sessionService.updateSession(session.idSession, session).subscribe({
        next: () => this.closeForm(true),
        error: () => alert("Erreur lors de la modification de la session.")
      });
    } else {
      this.sessionService.createSession(session).subscribe({
        next: () => this.closeForm(true),
        error: () => alert("Erreur lors de la création de la session.")
      });
    }
  }
}
