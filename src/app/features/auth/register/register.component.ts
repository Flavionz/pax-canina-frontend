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
import { Router, RouterLink } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
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

  get prenom(): AbstractControl { return this.registerForm.get('prenom')!; }
  get nom(): AbstractControl { return this.registerForm.get('nom')!; }
  get email(): AbstractControl { return this.registerForm.get('email')!; }
  get telephone(): AbstractControl { return this.registerForm.get('telephone')!; }
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
      const { prenom, nom, email, telephone, password } = this.registerForm.value;

      this.http.post(`${this.authService.baseUrl}/register/proprietaire`, {
        prenom, nom, email, telephone, password
      }).subscribe({
        next: () => {
          this.authService.login(email, password).subscribe({
            next: (success) => {
              this.loading = false;
              if (success) {
                this.router.navigate(['/dashboard']);
              } else {
                this.error = "Erreur lors de la connexion automatique.";
              }
            },
            error: () => {
              this.loading = false;
              this.error = "Erreur lors de la connexion automatique.";
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.error = "Erreur lors de l'inscription. Vérifiez vos informations.";
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
