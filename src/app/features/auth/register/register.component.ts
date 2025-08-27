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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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

  fieldErrors: Record<string, string> = {};

  private static readonly PHONE_REGEX = /^\+?[0-9 .-]{7,15}$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(RegisterComponent.PHONE_REGEX)]],
      password: ['', [Validators.required, Validators.minLength(8)]], // <— allineato al back
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
    this.successMessage = null;
    this.fieldErrors = {};

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.registerForm.disable();

    const { firstName, lastName, email, phone, password } = this.registerForm.value;

    this.http.post(`${this.authService.baseUrl}/register/owner`, {
      firstName, lastName, email, phone, password
    }).subscribe({
      next: (_res: any) => {
        this.loading = false;
        this.registerForm.enable();
        this.successMessage = "Inscription réussie ! Un e-mail de validation vient de vous être envoyé à l'adresse indiquée.";
        this.registerForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.registerForm.enable();

        if (err.status === 400 && err.error && typeof err.error === 'object' && err.error.errors) {
          this.fieldErrors = err.error.errors;
          this.error = "Certaines informations ne sont pas valides.";
        } else {
          this.error = "Erreur lors de l'inscription. Vérifiez vos informations ou réessayez plus tard.";
        }
      }
    });
  }
}
