import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';

import { NewEciQuestComponent } from './new-eci-quest/new-eci-quest.component';
import { PerfilComponent } from './perfil/perfil.component';
import { SalaComponent } from './sala/sala.component';


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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
