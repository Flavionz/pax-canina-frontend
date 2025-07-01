import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@core/models/user.model';
import { SpecialisationService } from '@core/services/specialisation.service';
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
  specialisations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private specialisationService: SpecialisationService
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
      specialisation: ['']
    });
  }

  ngOnInit() {
    // If editing, pre-fill the form
    if (this.user) this.form.patchValue(this.user);

    // Load specialisations if needed
    this.specialisationService.getSpecialisations().subscribe(specs => {
      this.specialisations = specs;
    });

    // Make specialisation required only for Coach
    this.form.get('role')!.valueChanges.subscribe(role => {
      if (role === 'COACH') {
        this.form.get('specialisation')!.setValidators(Validators.required);
      } else {
        this.form.get('specialisation')!.clearValidators();
      }
      this.form.get('specialisation')!.updateValueAndValidity();
    });
  }

  /**
   * Emit user data to parent on submit, if valid.
   */
  onSubmit() {
    if (this.form.valid) this.save.emit(this.form.value);
  }
}
