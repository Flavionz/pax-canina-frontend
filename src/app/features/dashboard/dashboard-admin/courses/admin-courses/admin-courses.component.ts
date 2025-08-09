import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { CourseService } from '@core/services/course.service';
import { Course } from '@core/models/course.model';
import { CourseFormComponent } from '../course-form/course-form.component';
import { Specialization } from '@core/models/specialization.model';
import { SpecializationService } from '@core/services/specialization.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss'],
  imports: [
    CommonModule,
    CourseFormComponent,
    RouterLink
  ]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];
  specializations: Specialization[] = [];
  formOpen = false;
  selectedCourse: Course | null = null;

  constructor(
    private courseService: CourseService,
    private specializationService: SpecializationService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadSpecializations();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: res => this.courses = res,
      error: () => { this.courses = []; }
    });
  }

  loadSpecializations(): void {
    // Usa il metodo corretto del tuo service (modifica se necessario)
    if (this.specializationService.getSpecializations) {
      this.specializationService.getSpecializations().subscribe({
        next: (res: Specialization[]) => this.specializations = res,
        error: () => { this.specializations = []; }
      });
    } else if (this.specializationService.getAll) {
      // fallback nel caso il service abbia il metodo chiamato diversamente
      this.specializationService.getAll().subscribe({
        next: (res: Specialization[]) => this.specializations = res,
        error: () => { this.specializations = []; }
      });
    }
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

  getDescriptionShort(desc?: string): string {
    if (!desc) return '';
    return desc.length > 50 ? desc.slice(0, 50) + '...' : desc;
  }


  /** Ritorna i nomi delle specializzazioni associate a un corso */
  getCourseSpecializations(course: Course): string[] {
    if (!course.specializations || !this.specializations.length) return [];
    return this.specializations
      .filter(spec => (course.specializations as number[]).includes(spec.id))
      .map(spec => spec.name);
  }
}
