import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  loading = false;
  serverError: string | null = null;
  success = false;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  form!: FormGroup; // <- dichiarazione
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public dialogRef: MatDialogRef<ChangePasswordComponent> // oppure private + onCancel()
  ) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: [this.matchPasswords] });
  }

  get currentPassword(): AbstractControl | null { return this.form.get('currentPassword'); }
  get newPassword(): AbstractControl | null { return this.form.get('newPassword'); }
  get confirmPassword(): AbstractControl | null { return this.form.get('confirmPassword'); }

  matchPasswords(group: AbstractControl) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmPassword')?.value;
    return np && cp && np === cp ? null : { mismatch: true };
  }

  get strength(): 'faible' | 'moyenne' | 'forte' {
    const v = this.newPassword?.value || '';
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) score++;
    if (v.length >= 12) score++;
    if (score >= 3) return 'forte';
    if (score === 2) return 'moyenne';
    return 'faible';
  }

  toggle(which: 'current'|'new'|'confirm') {
    if (which === 'current') this.showCurrent = !this.showCurrent;
    if (which === 'new') this.showNew = !this.showNew;
    if (which === 'confirm') this.showConfirm = !this.showConfirm;
  }

  onCancel() { this.dialogRef.close(); }

  submit() {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { currentPassword, newPassword } = this.form.value as { currentPassword: string; newPassword: string; };

    this.auth.changePassword(currentPassword, newPassword)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => this.dialogRef.close(true), 1000);
        },
        error: () => {
          this.serverError = "Échec de la modification. Vérifiez votre mot de passe actuel.";
        }
      });
  }
}
