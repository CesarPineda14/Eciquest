import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { MsalModule, MsalService, MsalGuard, MsalInterceptor, MsalBroadcastService, MsalRedirectComponent } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from "@azure/msal-browser";
import { NewEciQuestComponent } from './new-eci-quest/new-eci-quest.component';
import { PerfilComponent } from './perfil/perfil.component';
import { SalaComponent } from './sala/sala.component';
import { CrearSalaComponent } from './crear-sala/crear-sala.component';
import { UnirSalaComponent } from './unir-sala/unir-sala.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameOverDialogComponent } from './game-over-dialog/game-over-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

// export function MSALInstanceFactory(): PublicClientApplication {
//   return new PublicClientApplication({
//     auth: {
//       clientId: '933b58cd-d2c8-4c61-b229-f95d28c0bf40',
//       authority: 'https://login.microsoftonline.com/46def668-48dd-404a-8d73-43fc6a155b04',
//       redirectUri: 'http://localhost:4200'
//     }
//   });
// }



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'new', component: NewEciQuestComponent },
  { path: 'profile', component: PerfilComponent },
  { path: 'SalaComponent', component: SalaComponent },
  { path: 'CrearSala', component: CrearSalaComponent },
  { path: 'UnirSala', component: UnirSalaComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    NewEciQuestComponent,
    PerfilComponent,
    SalaComponent,
    CrearSalaComponent,
    UnirSalaComponent,
    GameOverDialogComponent
  ],
  imports: [
    MsalModule.forRoot(new PublicClientApplication(
      { 
      auth: {
        clientId: "933b58cd-d2c8-4c61-b229-f95d28c0bf40",
        authority: "https://login.microsoftonline.com/46def668-48dd-404a-8d73-43fc6a155b04",
        redirectUri: "https://eciquestv3.azurewebsites.net",
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: true, // set to true for IE 11
      },
      system: {
        loggerOptions: {
          loggerCallback: () => { },
          piiLoggingEnabled: false
        }
      }
    }), {
      interactionType: InteractionType.Redirect,
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']],
          ['https://api.myapplication.com/users/*', ['customscope.read']],
          
      ])
  }),
    BrowserModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
