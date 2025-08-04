import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '@core/models/user.model';
import { Specialization } from '@core/models/specialization.model';
import { CommonModule } from '@angular/common';

/**
 * UserFormComponent
 * -----------------
 * Jury-ready admin user creation/modification form for Pax Canina dashboard.
 * - Handles Owner, Coach, and Admin roles.
 * - Handles Coach specializations (at least one required if role is COACH).
 * - Emits form data as User DTO compatible with backend.
 * - Specializations are passed as @Input, never fetched inside this component.
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
  @Input() specializations: Specialization[] = [];  // Passate dal genitore!
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  selectedSpec: Specialization | null = null;
  specializationError = false;
  errorMsg: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['OWNER', Validators.required],
      bio: [''],
      avatarUrl: [''],
      specializations: [[]], // Solo per COACH
    });
  }

  ngOnInit() {
    // Patch della form (con badge oggetti) SOLO per la form!
    if (this.user) {
      const selected = (this.user.specializations ?? []).map(
        id => this.specializations.find(s => s.id === id)
      ).filter(Boolean) as Specialization[];
      this.form.patchValue({
        ...this.user,
        specializations: selected
      });
    }

    this.form.get('role')!.valueChanges.subscribe(() => this.validateSpecializations());
    this.form.get('specializations')!.valueChanges.subscribe(() => this.validateSpecializations());
    this.validateSpecializations();
  }

  /** Badge visualizzati */
  get selectedSpecializations(): Specialization[] {
    return this.form.value.specializations ?? [];
  }

  /** Opzioni disponibili per selezione (esclude già selezionati) */
  get availableSpecializations(): Specialization[] {
    const current = this.selectedSpecializations;
    return this.specializations.filter(
      s => !current.some(sel => sel.id === s.id)
    );
  }

  /** Aggiunge una specializzazione */
  addSpecialization() {
    if (this.selectedSpec) {
      const current = this.selectedSpecializations;
      this.form.patchValue({ specializations: [...current, this.selectedSpec] });
      this.selectedSpec = null;
      this.validateSpecializations();
    }
  }

  /** Rimuove una specializzazione */
  removeSpecialization(spec: Specialization) {
    const current = this.selectedSpecializations;
    this.form.patchValue({ specializations: current.filter(s => s.id !== spec.id) });
    this.validateSpecializations();
  }

  /** Validazione: almeno una specialization se COACH */
  validateSpecializations() {
    const isCoach = this.form.value.role === 'COACH';
    const list = this.selectedSpecializations;
    this.specializationError = isCoach && list.length < 1;
  }

  /**
   * Submit finale:
   * - trasforma oggetti in id (number[])
   * - solo per COACH, per gli altri è []
   * - emette DTO pronto per backend!
   */
  onSubmit() {
    this.errorMsg = null;
    const value = { ...this.form.value };

    // Remove specializations if not COACH
    if (value.role !== 'COACH') value.specializations = [];

    // Sempre mappa a id[]
    value.specializations = (value.specializations ?? []).map((s: Specialization) => s.id);

    this.save.emit({
      ...value,
      id: this.user?.id
    });
  }
}
