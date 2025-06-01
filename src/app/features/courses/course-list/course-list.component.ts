import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CourseService } from '@core/services/course.service';
import { Course } from '@core/models/course.model';

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

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Errore caricamento corsi:', err);
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
      (!this.searchTerm || course.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.selectedStatus || course.statut === this.selectedStatus)
    );
  }

  onAddCourse(): void { /*...*/ }
  onEditCourse(course: Course): void { /*...*/ }
  onDeleteCourse(course: Course): void { /*...*/ }
}
