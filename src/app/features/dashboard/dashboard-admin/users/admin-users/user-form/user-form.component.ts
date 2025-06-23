import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { User } from '@core/models/user.model';
import { SpecialisationService } from '@core/services/specialisation.service';
import {CommonModule} from '@angular/common';

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
export class UserFormComponent {
  @Input() user: User | null = null; // Se non null, siamo in edit
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  specialisations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private specialisationService: SpecialisationService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      role: ['PROPRIETAIRE', Validators.required],
      bio: [''],
      avatarUrl: [''],
      specialisation: ['']
    });
  }

  ngOnInit() {
    if (this.user) this.form.patchValue(this.user);

    this.specialisationService.getSpecialisations().subscribe(specs => {
      this.specialisations = specs;
    });

    this.form.get('role')!.valueChanges.subscribe(role => {
      if (role === 'COACH') {
        this.form.get('specialisation')!.setValidators(Validators.required);
      } else {
        this.form.get('specialisation')!.clearValidators();
      }
      this.form.get('specialisation')!.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.form.valid) this.save.emit(this.form.value);
  }
}
