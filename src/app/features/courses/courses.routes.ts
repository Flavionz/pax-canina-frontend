import { Routes } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    component: CourseListComponent
  }
];
