import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, SlicePipe } from '@angular/common';
import { CourseService } from '@core/services/course.service';
import { Course } from '@core/models/course.model';
import { CourseFormComponent } from '../course-form/course-form.component';

/**
 * Admin panel to manage courses.
 * Allows CRUD operations on all courses.
 */
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

  /**
   * Loads all courses for admin view.
   */
  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: res => this.courses = res,
      error: () => { this.courses = []; }
    });
  }

  /**
   * Opens the form for creating a new course.
   */
  openForm() {
    this.selectedCourse = null;
    this.formOpen = true;
  }

  /**
   * Opens the form for editing an existing course.
   * @param course Course to edit
   */
  editCourse(course: Course) {
    this.selectedCourse = course;
    this.formOpen = true;
  }

  /**
   * Closes the course form and reloads the list if needed.
   * @param refresh If true, reload courses after closing
   */
  closeForm(refresh: boolean = false) {
    this.formOpen = false;
    if (refresh) this.loadCourses();
  }

  /**
   * Deletes a course by id after confirmation.
   * @param id Course id to delete
   */
  deleteCourse(id: number) {
    if (confirm('Supprimer ce cours ?')) {
      this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
    }
  }

  /**
   * Handles saving a course (create or update).
   * @param course Course data from the form
   */
  handleSave(course: Course) {
    if (course.idCourse) {
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
