import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      conditions: [false, Validators.requiredTrue]
    });
  }

  // Getter con non-null assertion per rimuovere l’errore NG1
  get prenom(): AbstractControl {
    return this.registerForm.get('prenom')!;
  }
  get nom(): AbstractControl {
    return this.registerForm.get('nom')!;
  }
  get email(): AbstractControl {
    return this.registerForm.get('email')!;
  }
  get telephone(): AbstractControl {
    return this.registerForm.get('telephone')!;
  }
  get password(): AbstractControl {
    return this.registerForm.get('password')!;
  }
  get conditions(): AbstractControl {
    return this.registerForm.get('conditions')!;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Qui puoi chiamare il backend per la registrazione
      this.authService.login(); // Simula login dopo registrazione
      this.router.navigate(['/dashboard']);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
