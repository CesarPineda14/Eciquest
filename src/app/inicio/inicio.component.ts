import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  constructor(private router: Router) { }

  // redirectTosala() {
  //   this.router.navigate(['/SalaComponent']);
  // }

  redirectTosala() {
    this.router.navigate(['/UnirSala']);
  }

  redirectToPerfil() {
    this.router.navigate(['/perfil']);
  }

  redirectToCrearSala() {
    this.router.navigate(['/CrearSala']);
  }
}

