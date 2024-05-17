import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationStart } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { AuthGuard } from './login/AuthGuard.component'; // Ajusta la ruta según la ubicación
import { AuthService } from './login/AuthService.component';
import { PerfilComponent } from './perfil/perfil.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent , canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router, private authService: AuthService) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart && !this.authService.isAuthenticatedUser() && event.url !== '/login') {
        
    //     this.router.navigateByUrl('/login');
    //   }
    // });
  }
}

