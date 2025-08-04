import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Course } from '@core/models/course.model';
import { Specialization } from '@core/models/specialization.model';
import { SpecializationService } from '@core/services/specialization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-form',
  standalone: true,
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class CourseFormComponent implements OnInit {
  @Input() course: Course | null = null;
  @Output() close = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Course>();

  form: FormGroup;
  allSpecializations: Specialization[] = [];
  selectedSpec: Specialization | null = null;
  specializationError = false;

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['OPEN', Validators.required],
      imageUrl: [''],
      specializations: [[], Validators.required] // sarà array di Specialization in form, ma number[] in output
    });
  }

  ngOnInit() {
    // Carica le specializzazioni (solo una volta)
    this.specializationService.getAll().subscribe({
      next: specs => {
        this.allSpecializations = specs;
        // Se stiamo editando, patcha i valori
        if (this.course) {
          // `course.specializations` è array di numeri (id) in ingresso
          const selected = (this.course.specializations ?? [])
            .map((id: number) => specs.find(s => s.id === id))
            .filter(Boolean) as Specialization[];
          this.form.patchValue({
            ...this.course,
            specializations: selected
          });
        }
        this.validateSpecializations();
      }
    });

    this.form.get('specializations')!.valueChanges.subscribe(() => this.validateSpecializations());
  }

  get selectedSpecializations(): Specialization[] {
    return this.form.value.specializations ?? [];
  }

  get availableSpecializations(): Specialization[] {
    const current = this.selectedSpecializations;
    return this.allSpecializations.filter(s => !current.some(sel => sel.id === s.id));
  }

  addSpecialization() {
    if (this.selectedSpec) {
      const current = this.selectedSpecializations;
      this.form.patchValue({ specializations: [...current, this.selectedSpec] });
      this.selectedSpec = null;
      this.validateSpecializations();
    }
  }

  removeSpecialization(spec: Specialization) {
    const current = this.selectedSpecializations;
    this.form.patchValue({ specializations: current.filter(s => s.id !== spec.id) });
    this.validateSpecializations();
  }

  validateSpecializations() {
    this.specializationError = (this.selectedSpecializations.length < 1);
  }

  submit() {
    if (this.form.valid && !this.specializationError) {
      const value = { ...this.form.value };
      // Trasforma array di oggetti Specialization -> array di id (number[])
      value.specializations = (value.specializations ?? []).map((s: Specialization) => s.id);
      this.save.emit({
        ...(this.course || {}),
        ...value
      });
    }
  }

  closeModal() {
    this.close.emit(false);
  }
}
