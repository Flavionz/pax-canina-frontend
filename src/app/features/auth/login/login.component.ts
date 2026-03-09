import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.error = null;
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (success) => {
            if (success) {
              this.router.navigate(['/profile']);
            } else {
              this.error = "Identifiants invalides";
            }
          },
          error: () => {
            this.error = "Erreur de connexion. Veuillez réessayer.";
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
