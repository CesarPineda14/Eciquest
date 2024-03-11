import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';

import { NewEciQuestComponent } from './new-eci-quest/new-eci-quest.component';
import { PerfilComponent } from './perfil/perfil.component';
import { SalaComponent } from './sala/sala.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'new', component: NewEciQuestComponent }, 
  { path: 'profile', component: PerfilComponent }, 
  { path: 'SalaComponent', component: SalaComponent }, 
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    NewEciQuestComponent,
    PerfilComponent,
    SalaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
