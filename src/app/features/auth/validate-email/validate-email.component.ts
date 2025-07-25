import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-validate-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.scss']
})
export class ValidateEmailComponent implements OnInit {
  // State for UI feedback
  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // Retrieve the token from the URL parameter
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.status = 'error';
      this.message = 'Lien de validation invalide.';
      return;
    }

    // Call backend endpoint to validate the token
    this.http.get(`/api/users/validate?token=${token}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.status = 'success';
        this.message = 'Votre adresse e-mail a bien été validée ! Vous pouvez maintenant vous connecter.';
      },
      error: () => {
        this.status = 'error';
        this.message = 'Le lien est invalide ou expiré.';
      }
    });
  }

  // Redirect to login page after success
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
