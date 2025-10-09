import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.submitting = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // On successful login, navigate to the dashboard
        this.router.navigate(['/officer/dashboard']);
      },
      error: (err) => {
        this.errorMsg = 'Invalid username or password. Please try again.';
        this.submitting = false;
        console.error(err);
      }
    });
  }
}