import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '@core/models/user.model';
import { Specialization } from '@core/models/specialization.model';
import { SpecializationService } from '@core/services/specialization.service';
import { CommonModule } from '@angular/common';

/**
 * UserFormComponent
 * -----------------
 * Admin user creation/modification form for Pax Canina dashboard.
 * - Manages Owner, Coach, and Admin roles.
 * - Handles Coach specializations (at least one required if role is COACH).
 * - Emits form data as User DTO compatible with the backend.
 * - Password field is intentionally omitted; password is generated backend-side.
 */
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
    // Build the form structure (no password field, as password is backend-generated)
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['OWNER', Validators.required],
      bio: [''],
      avatarUrl: [''],
      specializations: [[]], // Only for COACH
    });
  }

  ngOnInit() {
    // Fetch available specializations from backend
    this.specializationService.getAll().subscribe(specs => {
      this.specializations = specs;
    });

    // If editing an existing user, patch form with existing values
    if (this.user) {
      this.form.patchValue({
        ...this.user,
        specializations: this.user.specializations ?? []
      });
    }

    // Reactively validate specializations on role/specializations change
    this.form.get('role')!.valueChanges.subscribe(() => this.validateSpecializations());
    this.form.get('specializations')!.valueChanges.subscribe(() => this.validateSpecializations());
    this.validateSpecializations();
  }

  /** Returns current list of selected specializations */
  get selectedSpecializations(): Specialization[] {
    return this.form.value.specializations ?? [];
  }

  /** Returns list of available specializations (excluding already selected) */
  get availableSpecializations(): Specialization[] {
    const current = this.selectedSpecializations;
    return this.specializations.filter(
      s => !current.some(sel => sel.id === s.id)
    );
  }

  /** Add selected specialization to the list */
  addSpecialization() {
    if (this.selectedSpec) {
      const current = this.selectedSpecializations;
      this.form.patchValue({ specializations: [...current, this.selectedSpec] });
      this.selectedSpec = null;
      this.validateSpecializations();
    }
  }

  /** Remove a specialization from the list */
  removeSpecialization(spec: Specialization) {
    const current = this.selectedSpecializations;
    this.form.patchValue({ specializations: current.filter(s => s.id !== spec.id) });
    this.validateSpecializations();
  }

  /** Validates that at least one specialization is selected for COACH role */
  validateSpecializations() {
    const isCoach = this.form.value.role === 'COACH';
    const list = this.selectedSpecializations;
    this.specializationError = isCoach && list.length < 1;
  }

  /**
   * Handles form submission.
   * - Converts specializations to array of ids for backend DTO.
   * - Ensures non-COACH users send empty specialization array.
   * - Emits the User DTO to parent.
   */
  onSubmit() {
    this.errorMsg = null;
    const value = { ...this.form.value };

    // Remove specializations if not COACH
    if (value.role !== 'COACH') value.specializations = [];

    // Convert specializations (array of objects) to array of ids
    value.specializations = (value.specializations ?? []).map((s: Specialization) => s.id);

    this.save.emit({
      ...value,
      id: this.user?.id
    });
  }
}
