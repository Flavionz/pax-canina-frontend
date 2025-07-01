import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CourseService } from '@core/services/course.service';
import { Course } from '@core/models/course.model';

/**
 * Component for listing courses (preview or full CRUD table).
 */
@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  @Input() previewMode = false;
  @Input() previewCount = 3;

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm = '';
  selectedStatus = '';

  // You should get the userRole from an AuthService in production
  userRole = 'admin';

  get canAddCourse() {
    return this.userRole === 'admin' || this.userRole === 'coach';
  }
  get canEditCourse() {
    return this.userRole === 'admin' || this.userRole === 'coach';
  }
  get canDeleteCourse() {
    return this.userRole === 'admin';
  }

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  /**
   * Loads the list of courses from the API.
   */
  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  /**
   * Courses to display in preview mode.
   */
  get displayedCourses(): Course[] {
    return this.previewMode
      ? this.courses.slice(0, this.previewCount)
      : this.courses;
  }

  /**
   * Filters courses based on search term and status.
   */
  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course =>
      (!this.searchTerm || course.name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.selectedStatus || course.status === this.selectedStatus)
    );
  }

  onAddCourse(): void {
    // To implement: open add course dialog or route
  }
  onEditCourse(course: Course): void {
    // To implement: open edit dialog or route
  }
  onDeleteCourse(course: Course): void {
    // To implement: confirmation and delete
  }
}
