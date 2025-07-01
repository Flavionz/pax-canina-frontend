import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Session } from '@core/models/session.model';
import { Course } from '@core/models/course.model';
import { AgeGroup } from '@core/models/age-group.model';


@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss']
})
export class SessionFormComponent implements OnInit {
  @Input() session: Session | null = null;
  @Input() courses: Course[] = [];
  @Input() ageGroups: AgeGroup[] = [];
  @Output() save = new EventEmitter<Session>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      courseId:    [this.session?.course?.idCourse ?? '', Validators.required],
      date:        [this.session?.date ?? '', Validators.required],
      startTime:   [this.session?.startTime ?? '', Validators.required],
      endTime:     [this.session?.endTime ?? '', Validators.required],
      level:       [this.session?.level ?? '', Validators.required],
      maxCapacity: [this.session?.maxCapacity ?? '', [Validators.required, Validators.min(1)]],
      location:    [this.session?.location ?? ''],
      imageUrl:    [this.session?.imageUrl ?? ''],
      description: [this.session?.description ?? ''],
      ageGroupId:  [this.session?.ageGroup?.idAgeGroup ?? '', Validators.required]
    });
  }

  /**
   * Emits the session object with all necessary fields for backend creation or update.
   * Maps the selected course and age group by their IDs.
   */
  submit(): void {
    if (this.form.valid) {
      const value = this.form.value;
      const courseObj = this.courses.find(c => c.idCourse == value.courseId);
      const ageGroupObj = this.ageGroups.find(a => a.idAgeGroup == value.ageGroupId);

      // Ensure course and age group are selected (should never fail if form is valid)
      if (!courseObj || !ageGroupObj) return;

      const session: Session = {
        ...this.session,
        date: value.date,
        startTime: value.startTime,
        endTime: value.endTime,
        level: value.level,
        maxCapacity: value.maxCapacity,
        location: value.location,
        imageUrl: value.imageUrl,
        description: value.description,
        course: courseObj,
        ageGroup: ageGroupObj,
        status: this.session?.status ?? 'available'
      };
      this.save.emit(session);
    }
  }

  /**
   * Emits close event to parent (close modal/dialog).
   */
  closeModal(): void {
    this.close.emit();
  }

  /**
   * Utility for translating age group enum names to French for the UI.
   */
  translateAgeGroup(name: string): string {
    switch (name) {
      case 'PUPPY': return 'Chiot';
      case 'JUNIOR': return 'Junior';
      case 'ADULT': return 'Adulte';
      case 'SENIOR': return 'Senior';
      default: return name;
    }
  }
}
