import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CourseService } from '@core/services/course.service';
import { SessionService } from '@core/services/session.service';
import { UserService } from '@core/services/user.service';
import { DogService } from '@core/services/dog.service';
import { SpecialisationService } from '@core/services/specialisation.service';
import { AdminService } from '@core/services/admin.service';
import { Admin } from '@core/models/admin.model';

/**
 * Admin overview dashboard.
 * Displays quick links and counts for core resources.
 */
@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss']
})
export class AdminOverviewComponent implements OnInit {
  // Summary counts for dashboard (ENGLISH KEYS!)
  counts = {
    courses: 0,
    sessions: 0,
    users: 0,
    dogs: 0,
    specialisations: 0
  };

  // Current admin display name
  adminName = '';

  constructor(
    private courseService: CourseService,
    private sessionService: SessionService,
    private userService: UserService,
    private dogService: DogService,
    private specialisationService: SpecialisationService,
    private adminService: AdminService,
    private router: Router
  ) {}

  /**
   * Loads all counts and admin profile on initialization.
   */
  ngOnInit(): void {
    // Fetch all resource counts in parallel
    forkJoin([
      this.courseService.getCourses(),
      this.sessionService.getSessions(),
      this.userService.getAllUsers(),
      this.dogService.getAllDogs(),
      this.specialisationService.getSpecialisations()
    ]).subscribe({
      next: ([courses, sessions, users, dogs, specialisations]) => {
        this.counts.courses           = courses.length;
        this.counts.sessions          = sessions.length;
        this.counts.users             = users.length;
        this.counts.dogs              = dogs.length;
        this.counts.specialisations   = specialisations.length;
      }
    });

    // Fetch admin display name for greeting
    this.adminService.getProfile().subscribe({
      next: (admin: Admin) => {
        this.adminName = `${admin.firstName} ${admin.lastName}`;
      },
      error: () => {
        this.adminName = 'Admin';
      }
    });
  }
}
