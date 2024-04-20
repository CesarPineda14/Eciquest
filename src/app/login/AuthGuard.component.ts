import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './AuthService.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticatedUser()) {
      return true; // Permite el acceso si el usuario está autenticado
    } else {
      this.router.navigateByUrl('/login'); // Redirige al login si el usuario no está autenticado
      return false;
    }
  }
}


