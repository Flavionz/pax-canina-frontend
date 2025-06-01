import { Routes } from '@angular/router';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./course-list/course-list.component').then(m => m.CourseListComponent)
  }
];
