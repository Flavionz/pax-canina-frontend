// src/app/features/dashboard/dashboard-admin/dashboard-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CourseService } from '@core/services/course.service';
import { SessionService } from '@core/services/session.service';
import { CoachService } from '@core/services/coach.service';
import { UserService } from '@core/services/user.service';
import { DogService } from '@core/services/dog.service';
import { RaceService } from '@core/services/race.service';
import { AgeRangeService } from '@core/services/age-range.service';
import { SpecialisationService } from '@core/services/specialisation.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  counts = {
    cours: 0,
    sessions: 0,
    coaches: 0,
    users: 0,
    dogs: 0,
    races: 0,
    ageRanges: 0,
    specialisations: 0
  };

  constructor(
    private courseService: CourseService,
    private sessionService: SessionService,
    private coachService: CoachService,
    private userService: UserService,
    private dogService: DogService,
    private raceService: RaceService,
    private ageRangeService: AgeRangeService,
    private specialisationService: SpecialisationService
  ) {}

  ngOnInit(): void {
    forkJoin({
      cours:          this.courseService.getCourses(),
      sessions:       this.sessionService.getSessions(),
      coaches:        this.coachService.getCoaches(),
      users:          this.userService.getAllUsers(),
      dogs:           this.dogService.getAllDogs(),
      races:          this.raceService.getRaces(),
      ageRanges:      this.ageRangeService.getAgeRanges(),
      specialisations:this.specialisationService.getSpecialisations()
    }).subscribe(res => {
      this.counts.cours           = res.cours.length;
      this.counts.sessions        = res.sessions.length;
      this.counts.coaches         = res.coaches.length;
      this.counts.users           = res.users.length;
      this.counts.dogs            = res.dogs.length;
      this.counts.races           = res.races.length;
      this.counts.ageRanges       = res.ageRanges.length;
      this.counts.specialisations = res.specialisations.length;
    });
  }
}
