import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  submitted = false;    // <— il template usa "submitted"
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // getter usato nel template
  get email() { return this.form.get('email'); }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth.requestPasswordReset(this.form.value.email!)
      .subscribe({
        next: () => { this.submitted = true; this.loading = false; },
        error: () => { this.submitted = true; this.loading = false; } // anti-enumeration: sempre OK lato BE
      });
  }
}
