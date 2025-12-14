import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. First, ensure the user is actually logged in (defensive check)
  if (!authService.isAuthenticated()) {
    router.navigate(['/officer/login']);
    return false;
  }

  // 2. Check if the user has the 'reviewer' role
  if (authService.isReviewer()) {
    return true; // Authorized
  } else {
    // 3. User is logged in but NOT a reviewer
    alert('Access Denied: Only Reviewers can register new Admins.');
    router.navigate(['/officer/dashboard']);
    return false;
  }
};