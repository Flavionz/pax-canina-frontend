import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { CourseService } from '@services/course.service';
import { SessionService } from '@services/session.service';
import { User } from '@models/user.model';
import { Course } from '@models/course.model';
import { Session } from '@models/session.model';

import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  users: User[] = [];
  courses: Course[] = [];
  sessions: Session[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.loading = true;
    // Adatta queste chiamate: in produzione vorrai chiamate paginazione o contatori, qui usiamo tutto per semplicità
    this.courseService.getCourses().subscribe(courses => this.courses = courses || []);
    this.sessionService.getSessions().subscribe(sessions => this.sessions = sessions || []);
    // Se vuoi il totale utenti, adatta con un servizio apposito; qui placeholder
    this.userService.getUserProfile().subscribe(user => {
      // placeholder, aggiorna con vera logica admin
      this.users = [user];
      this.loading = false;
    });
  }
}
