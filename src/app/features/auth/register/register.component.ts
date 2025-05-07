import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
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

  get prenom() { return this.registerForm.get('prenom'); }
  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get telephone() { return this.registerForm.get('telephone'); }
  get password() { return this.registerForm.get('password'); }
  get conditions() { return this.registerForm.get('conditions'); }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Qui puoi chiamare il backend per la registrazione
      // Per ora simula la registrazione e logga l'utente
      this.authService.login(); // Simula login dopo registrazione
      this.router.navigate(['/dashboard']);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

