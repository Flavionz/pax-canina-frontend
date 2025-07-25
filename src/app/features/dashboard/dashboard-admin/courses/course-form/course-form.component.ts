import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '@core/models/course.model';
import { Specialization } from '@core/models/specialization.model';
import { SpecializationService } from '@core/services/specialization.service';

/**
 * Modal form for creating/updating a course, including selection of one or more specializations (by ID).
 * - Follows backend naming conventions.
 * - Works with an array of specialization ids (number[]).
 * - Emits Course object with id array for CRUD compatibility.
 */
@Component({
  selector: 'app-course-form',
  standalone: true,
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CourseFormComponent implements OnInit {
  @Input() course: Course | null = null;
  @Output() close = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Course>();

  form!: FormGroup;
  allSpecializations: Specialization[] = [];

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService
  ) {}

  ngOnInit() {
    // Initialize the form with the course data (or defaults).
    this.form = this.fb.group({
      name:          [this.course?.name ?? '', Validators.required],
      description:   [this.course?.description ?? '', Validators.required],
      status:        [this.course?.status ?? 'OPEN', Validators.required],
      imageUrl:      [this.course?.imageUrl ?? ''],
      // Specializations: store and handle as array of IDs!
      specializations: [
        // Se il course esiste già: array di id, altrimenti array vuoto
        Array.isArray(this.course?.specializations)
          ? this.course!.specializations
          : [],
        Validators.required
      ]
    });

    // Fetch all available specializations for the select.
    this.specializationService.getAll().subscribe({
      next: specs => this.allSpecializations = specs
    });
  }

  /**
   * Emit save event with Course object including specialization id array.
   * @returns void
   */
  submit() {
    if (this.form.valid) {
      const result: Course = {
        ...this.course,
        ...this.form.value,
        // Assicurati che specializations sia sempre un array di id (number[])
        specializations: this.form.value.specializations
      };
      this.save.emit(result);
    }
  }

  /**
   * Emit close event to parent.
   * @returns void
   */
  closeModal() {
    this.close.emit(false);
  }
}
