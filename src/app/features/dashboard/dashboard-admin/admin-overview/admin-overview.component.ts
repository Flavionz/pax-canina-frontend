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

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss']
})
export class AdminOverviewComponent implements OnInit {
  counts = {
    cours: 0,
    sessions: 0,
    users: 0,
    dogs: 0,
    specialisations: 0
  };
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

  ngOnInit(): void {
    forkJoin({
      cours:          this.courseService.getCourses(),
      sessions:       this.sessionService.getSessions(),
      users:          this.userService.getAllUsers(),
      dogs:           this.dogService.getAllDogs(),
      specialisations:this.specialisationService.getSpecialisations()
    }).subscribe(res => {
      this.counts.cours           = res.cours.length;
      this.counts.sessions        = res.sessions.length;
      this.counts.users           = res.users.length;
      this.counts.dogs            = res.dogs.length;
      this.counts.specialisations = res.specialisations.length;
    });

    this.adminService.getProfile().subscribe({
      next: (admin: Admin) => {
        this.adminName = `${admin.prenom} ${admin.nom}`;
      },
      error: () => {
        this.adminName = 'Admin';
      }
    });
  }
}
