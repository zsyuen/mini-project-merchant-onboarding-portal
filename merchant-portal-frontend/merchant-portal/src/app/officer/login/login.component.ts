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
  totpForm: FormGroup;
  errorMsg = '';
  submitting = false;
  requireTotp = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.totpForm = this.fb.group({
      totpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onLogin(): void {
  if (this.loginForm.invalid) {
    return;
  }
  this.submitting = true;
  this.errorMsg = '';

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      // After valid credentials, always require TOTP for officers
      this.authService.saveTempToken(response.tempToken);
      this.requireTotp = true;
      this.submitting = false;
    },
    error: (err) => {
      this.errorMsg = 'Invalid username or password. Please try again.';
      this.submitting = false;
      console.error(err);
    }
  });
}

  onVerifyTotp(): void {
    if (this.totpForm.invalid) {
      return;
    }
    this.submitting = true;
    this.errorMsg = '';

    const tempToken = this.authService.getTempToken();
    const totpCode = this.totpForm.value.totpCode;

    if (!tempToken) {
      this.errorMsg = 'Session expired. Please login again.';
      this.resetToLogin();
      return;
    }

    this.authService.verifyTotp(tempToken, totpCode).subscribe({
      next: () => {
        this.authService.clearTempToken();
        this.router.navigate(['/officer/dashboard']);
      },
      error: (err) => {
        this.errorMsg = 'Invalid verification code. Please try again.';
        this.submitting = false;
        this.totpForm.patchValue({ totpCode: '' });
        console.error(err);
      }
    });
  }

  resetToLogin(): void {
    this.requireTotp = false;
    this.submitting = false;
    this.errorMsg = '';
    this.loginForm.reset();
    this.totpForm.reset();
    this.authService.clearTempToken();
  }

  goBack(): void {
    this.resetToLogin();
  }
}