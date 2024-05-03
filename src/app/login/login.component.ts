import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './AuthService.component';
import { DataService } from '../comunicacion';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  username!: string;
  password!: string;
  loginError: boolean = false;

  constructor(private router: Router, private authService: AuthService, private data:DataService) { }

  ngOnInit(): void {
    console.log('LoginComponent inicializado');
  }

  redirectToInicio() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/inicio'], { replaceUrl: true });
      this.data.setNombre(this.username);
    } else {
      this.loginError = true;
    }
  }
}

