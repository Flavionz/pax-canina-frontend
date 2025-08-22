import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  error: string | null = null;
  loading = false;

  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      conditions: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordsMatchValidator()
    });
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pwd = group.get('password')?.value;
      const cpw = group.get('confirmPassword')?.value;
      return pwd === cpw ? null : { passwordMismatch: true };
    };
  }

  get firstName(): AbstractControl { return this.registerForm.get('firstName')!; }
  get lastName(): AbstractControl { return this.registerForm.get('lastName')!; }
  get email(): AbstractControl { return this.registerForm.get('email')!; }
  get phone(): AbstractControl { return this.registerForm.get('phone')!; }
  get password(): AbstractControl { return this.registerForm.get('password')!; }
  get confirmPassword(): AbstractControl { return this.registerForm.get('confirmPassword')!; }
  get conditions(): AbstractControl { return this.registerForm.get('conditions')!; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.error = null;
    if (this.registerForm.valid) {
      this.loading = true;
      const { firstName, lastName, email, phone, password } = this.registerForm.value;

      this.http.post(`${this.authService.baseUrl}/register/owner`, {
        firstName, lastName, email, phone, password
      }).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = "Inscription réussie ! Un e-mail de validation vient de vous être envoyé à l'adresse indiquée.";
          this.registerForm.reset();
        },
        error: () => {
          this.loading = false;
          this.error = "Erreur lors de l'inscription. Vérifiez vos informations ou essayez plus tard.";
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
