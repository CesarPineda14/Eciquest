import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './AuthService.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username!: string;
  password!: string;
  loginError: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  redirectToInicio() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/inicio'], { replaceUrl: true }); // Redirige a la página de inicio y reemplaza la URL en el historial
    } else {
      this.loginError = true;
    }
  }
}

