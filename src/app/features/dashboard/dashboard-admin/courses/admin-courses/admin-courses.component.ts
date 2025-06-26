import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, SlicePipe } from '@angular/common';
import { CourseService } from '@core/services/course.service';
import { Course } from '@core/models/course.model';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss'],
  imports: [
    CommonModule,
    NgClass,
    SlicePipe,
    CourseFormComponent
  ]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];
  formOpen = false;
  selectedCourse: Course | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: res => this.courses = res,
      error: () => { this.courses = []; }
    });
  }

  openForm() {
    this.selectedCourse = null;
    this.formOpen = true;
  }
  editCourse(course: Course) {
    this.selectedCourse = course;
    this.formOpen = true;
  }
  closeForm(refresh: boolean = false) {
    this.formOpen = false;
    if (refresh) this.loadCourses();
  }
  deleteCourse(id: number) {
    if (confirm('Supprimer ce cours ?')) {
      this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
    }
  }

  handleSave(course: Course) {
    // Differenzia tra creazione e modifica!
    if (course.idCours) {
      this.courseService.updateCourse(course).subscribe({
        next: () => this.closeForm(true),
        error: () => alert("Erreur lors de la modification du cours.")
      });
    } else {
      this.courseService.createCourse(course).subscribe({
        next: () => this.closeForm(true),
        error: () => alert("Erreur lors de la création du cours.")
      });
    }
  }
}
