import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private msalService: MsalService, private http: HttpClient) { }

  checkAuthentication(): void {
    const account = this.msalService.instance.getAllAccounts()[0];
    this.isAuthenticated.next(!!account);
  }

  updateAuthenticationState(isAuthenticated: boolean): void {
    this.isAuthenticated.next(isAuthenticated);
    console.log(isAuthenticated)
  }

  get isAuthenticated$() {
    return this.isAuthenticated.asObservable();
  }
  logout(): void {
    const logoutUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/logout';
    const postLogoutRedirectUri = encodeURIComponent('http://localhost:4200');
    const fullLogoutUrl = `${logoutUrl}?post_logout_redirect_uri=${postLogoutRedirectUri}`;
    window.location.href = fullLogoutUrl;
    localStorage.clear();
    sessionStorage.clear();
  }
}
