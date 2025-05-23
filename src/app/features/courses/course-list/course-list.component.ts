import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '@core/services/course.service';
import { Course } from '@core/models/course.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  @Input() previewMode = false;
  @Input() previewCount = 3;

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm = '';
  selectedStatus = '';

  // Simulazione ruolo (integra con il tuo auth service)
  userRole = 'admin'; // 'admin', 'coach', 'user'
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

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(
      (data: Course[]) => {
        this.courses = data;
        this.applyFilters();
      },
      (error: any) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  get displayedCourses(): Course[] {
    return this.previewMode
      ? this.courses.slice(0, this.previewCount)
      : this.courses;
  }

  applyFilters() {
    // Solo usato nella pagina principale
    this.filteredCourses = this.courses.filter(course =>
      (!this.searchTerm || course.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.selectedStatus || course.statut === this.selectedStatus)
    );
  }

  onAddCourse() { /* ... */ }
  onEditCourse(course: Course) { /* ... */ }
  onDeleteCourse(course: Course) { /* ... */ }
}
