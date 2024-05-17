import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/AuthService.component';
import { UserService } from './UserService.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  currentUser: any = {
    username: '',
    email: '',
    password: '',
    bio: '',
    avatar: null  // Aquí puedes almacenar la URL de la imagen seleccionada
  };

  // Lista de imágenes disponibles para que el usuario elija
  availableImages: string[] = [
    'assets/images/batman.png',
    'assets/images/jefe.jpg',
    'assets/images/tortuga.png',
    // Agrega más imágenes según sea necesario
  ];

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    // this.currentUser = this.authService.getCurrentUser();
  }

  selectImage(imageUrl: string): void {
    this.currentUser.avatar = imageUrl;

  }

  saveProfile(): void {
    // Llama al método del servicio para actualizar el perfil del usuario
    // this.authService.updateUserProfile(this.currentUser);
    // Puedes redirigir a otra página después de guardar los cambios si es necesario
    // this.router.navigate(['/inicio']);
  }
}
