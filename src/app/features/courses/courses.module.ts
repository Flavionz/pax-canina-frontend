import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './component/course-list/course-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    CourseListComponent
  ],
  exports: [CourseListComponent]
})
export class CoursesModule {}
