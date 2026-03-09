import { Route } from '@angular/router';
import { CourseListComponent }   from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

export const COURSES_ROUTES: Route[] = [
  { path: '',    component: CourseListComponent  },
  { path: ':id', component: CourseDetailComponent }
];
