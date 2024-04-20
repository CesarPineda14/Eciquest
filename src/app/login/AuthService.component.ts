import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'jordy.bautista@mail.escuelaing.edu.co', password: 'jordy.bautista' },
    { username: 'javier.toquica@escuelaing.edu.co', password: 'javier.toquica' },
    { username: 'diego.trivino@escuelaing.edu.co', password: 'diego.trivino' },
    { username: 'andres.arias-a@mail.escuelaing.edu.co', password: 'andres.arias-a' },
    { username: 'cesar.amaya-g@mail.escuelaing.edu.co', password: 'cesar.amaya-g' },
    { username: 'yhonatan.gomez@mail.escuelaing.edu.co', password: 'yhonatan.gomez' },
    { username: 'juan.alvarez-b@mail.escuelaing.edu.co', password: 'juan.alvarez-b' },
    { username: 'sebastian.blanco@mail.escuelaing.edu.co', password: 'sebastian.blanco' },
    { username: 'johan.garcia@mail.escuelaing.edu.co', password: 'johan.garcia' },
    { username: 'gabriel.silva@mail.escuelaing.edu.co', password: 'gabriel.silva' },
    { username: 'hann.jang@mail.escuelaing.edu.co', password: 'hann.jang' },
    { username: 'sergio.lopez-v@mail.escuelaing.edu.co', password: 'sergio.lopez-v' },
    { username: 'carolina.medina-a@mail.escuelaing.edu.co', password: 'carolina.medina-a' },
    { username: 'jose.correa-r@mail.escuelaing.edu.co', password: 'jose.correa-r' },
    { username: 'juan.poveda-ca@mail.escuelaing.edu.co', password: 'juan.poveda-ca' },
    { username: 'juan.camargo-s@mail.escuelaing.edu.co', password: 'juan.camargo-s' },
    { username: 'carlos.sorza@mail.escuelaing.edu.co', password: 'carlos.sorza' },
    { username: 'sebastian.zamora-u@mail.escuelaing.edu.co', password: 'sebastian.zamora-u' },
    { username: 'juan.vivas-m@mail.escuelaing.edu.co', password: 'juan.vivas-m' },
    { username: 'christian.duarte@mail.escuelaing.edu.co', password: 'christian.duarte' },
    { username: 'jose.mahecha@mail.escuelaing.edu.co', password: 'jose.mahecha' },
    { username: 'daniel.moreno-c@mail.escuelaing.edu.co', password: 'daniel.moreno-c' },
    { username: 'steven.huertas@mail.escuelaing.edu.co', password: 'steven.huertas' },
    { username: 'daniel.perez-b@mail.escuelaing.edu.co', password: 'daniel.perez-b' },
    { username: 'cesar.pineda-d@mail.escuelaing.edu.co', password: 'cesar.pineda-d' },
    { username: 'nicolas.castro-j@mail.escuelaing.edu.co', password: 'nicolas.castro-j' },
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'user3', password: 'password3' },
    { username: 'user4', password: 'password4' },
    { username: 'user5', password: 'password5' },
    { username: 'user6', password: 'password6' }
    // Agrega más usuarios aquí según sea necesario
  ];

  private isAuthenticated = false;
  private currentUser: any = null;

  constructor() { }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.isAuthenticated = true;
      this.currentUser = user;
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  updateUserProfile(user: any): void {
    // Aquí puedes implementar la lógica para actualizar el perfil del usuario
    // Por ejemplo, guardar los cambios en una base de datos o almacenamiento persistente
    console.log('Usuario actualizado:', user);
    // Ejemplo de implementación: this.http.put('/api/user', user);
  }
}

