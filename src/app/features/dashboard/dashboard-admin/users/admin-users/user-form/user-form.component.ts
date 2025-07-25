import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '@core/models/user.model';
import { Specialization } from '@core/models/specialization.model';
import { SpecializationService } from '@core/services/specialization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  specializations: Specialization[] = [];
  selectedSpec: Specialization | null = null;
  specializationError = false;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['OWNER', Validators.required],
      bio: [''],
      avatarUrl: [''],
      specializations: [[]],
    });
  }

  ngOnInit() {
    this.specializationService.getAll().subscribe(specs => {
      this.specializations = specs;
    });

    if (this.user) {
      this.form.patchValue({
        ...this.user,
        specializations: this.user.specializations ?? []
      });
    }

    // Controllo specializzazioni ogni volta che cambia ruolo o la lista
    this.form.get('role')!.valueChanges.subscribe(() => this.validateSpecializations());
    this.form.get('specializations')!.valueChanges.subscribe(() => this.validateSpecializations());
    this.validateSpecializations();
  }

  get selectedSpecializations(): Specialization[] {
    return this.form.value.specializations ?? [];
  }

  get availableSpecializations(): Specialization[] {
    const current = this.selectedSpecializations;
    return this.specializations.filter(
      s => !current.some(sel => sel.id === s.id)
    );
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
    const isCoach = this.form.value.role === 'COACH';
    const list = this.selectedSpecializations;
    this.specializationError = isCoach && list.length < 1;
  }

  onSubmit() {
    this.errorMsg = null;
    const value = { ...this.form.value };

    // Pulizia: se non è coach, niente specializzazioni
    if (value.role !== 'COACH') value.specializations = [];

    this.save.emit({
      ...value,
      id: this.user?.id
    });
  }
}
