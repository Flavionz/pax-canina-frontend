import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService } from '@core/services/course.service';
import { Course } from '@core/models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  @Input() previewMode = false;
  @Input() previewCount = 3;

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm = '';


  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

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

  get displayedCourses(): Course[] {
    return this.previewMode
      ? this.courses.slice(0, this.previewCount)
      : this.courses;
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course =>
      !this.searchTerm || course.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onAddCourse(): void {
    // Solo per admin: implementa dialog/modal
  }
}
