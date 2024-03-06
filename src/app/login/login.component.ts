import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor() { }

  login() {
    // Aquí puedes implementar la lógica de autenticación
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    // Por ejemplo, podrías hacer una solicitud HTTP a tu backend para autenticar al usuario
  }
}

