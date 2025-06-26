import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '@core/models/course.model';

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

  ngOnInit() {
    this.form = this.fb.group({
      nom: [this.course?.nom || '', Validators.required],
      description: [this.course?.description || '', Validators.required],
      statut: [this.course?.statut || 'OUVERT', Validators.required],
      imgUrl: [this.course?.imgUrl || '']
    });
  }

  submit() {
    if (this.form.valid) {
      const result: Course = {
        ...this.course,
        ...this.form.value
      };
      this.save.emit(result);
    }
  }

  closeModal() {
    this.close.emit(false);
  }
}
