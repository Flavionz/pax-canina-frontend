import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@core/models/user.model';
import { SpecializationService } from '@core/services/specialization.service';
import { CommonModule } from '@angular/common';

/**
 * Form for creating or editing a user (Admin, Coach, Owner).
 * All model fields are in English to match backend & database.
 * All labels and options are in French for the UX jury!
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null; // If set, we're editing; otherwise, creating
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  specializations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService
  ) {
    // Always use English field names for the model
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['OWNER', Validators.required],
      bio: [''],
      avatarUrl: [''],
      specialization: ['']
    });
  }

  ngOnInit() {
    // If editing, pre-fill the form
    if (this.user) this.form.patchValue(this.user);

    // Load specializations for select
    this.specializationService.getAll().subscribe(specs => {
      this.specializations = specs;
    });

    // Make specialization required only for Coach
    this.form.get('role')!.valueChanges.subscribe(role => {
      const specializationCtrl = this.form.get('specialization');
      if (role === 'COACH') {
        specializationCtrl!.setValidators(Validators.required);
      } else {
        specializationCtrl!.clearValidators();
      }
      specializationCtrl!.updateValueAndValidity();
    });
  }

  /**
   * Emit user data to parent on submit, if valid.
   */
  onSubmit() {
    if (this.form.valid) this.save.emit(this.form.value);
  }
}
