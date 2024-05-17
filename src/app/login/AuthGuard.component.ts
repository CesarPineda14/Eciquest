import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: MsalService, private router: Router) {}

  canActivate(): boolean {
    const account = this.authService.instance.getAllAccounts()[0];
    if (account) {
      console.log("account:",account)
      return true;
      
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
