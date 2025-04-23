import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from '@shared/shared-material.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CourseListComponent } from '@app/features/courses/component/course-list/course-list.component';
import { CoursesModule } from '@app/features/courses/courses.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedMaterialModule,
    MatCardModule,
    MatButtonModule,
    CourseListComponent,
    CoursesModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
