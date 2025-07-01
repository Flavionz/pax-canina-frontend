import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '@core/models/course.model';

/**
 * Course form component for create/edit.
 * All field names follow backend/model naming (English).
 * UI/labels/messages are in French (user-facing).
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

  constructor(private fb: FormBuilder) {}

  /**
   * Initializes the form with course data (if present).
   * Uses English field names for backend consistency.
   */
  ngOnInit() {
    this.form = this.fb.group({
      name:      [this.course?.name      || '', Validators.required],
      description: [this.course?.description || '', Validators.required],
      status:    [this.course?.status    || 'OPEN', Validators.required],
      imageUrl:  [this.course?.imageUrl  || '']
    });
  }

  /**
   * Emits save event with form data.
   */
  submit() {
    if (this.form.valid) {
      const result: Course = {
        ...this.course,
        ...this.form.value
      };
      this.save.emit(result);
    }
  }

  /**
   * Emits close event.
   */
  closeModal() {
    this.close.emit(false);
  }
}
