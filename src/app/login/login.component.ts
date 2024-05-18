import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionType, PopupRequest } from '@azure/msal-browser';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from '../comunicacion';

interface UserDetails {
  '@odata.context': string;
  displayName: string;
  jobTitle: string | null;  
  mail: string | null;
  department: string | null;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private socketService: DataService,private http: HttpClient,private authService: MsalService, private router: Router) { 
  }

  ngOnInit() {
    this.initializeMsal();
    this.checkAuthentication();
  }
  password =""
  username = ""
  isAutenticated = false

  


  async initializeMsal() {
    try {
      await this.authService.instance.initialize(); 
    } catch (error) {
    }
  }

  checkAuthentication() {
    const account = this.authService.instance.getAllAccounts()[0];
    if (account) {
      this.authService.instance.setActiveAccount(account);
      this.isAutenticated = true;
      this.router.navigate(['/inicio']); 
    }
  }
  login() {
    const request: PopupRequest = {
      scopes: ["user.read"],
      prompt: "select_account",
      redirectUri: 'https://eciquestv3.azurewebsites.net',  
      authority: 'https://login.microsoftonline.com/46def668-48dd-404a-8d73-43fc6a155b04',  
    };

    this.authService.loginPopup(request)
      .subscribe({
        next: (result) => {
          this.authService.instance.setActiveAccount(result.account);
          this.getUserDetails()
          
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
  }

  getUserDetails() {
    const request = { scopes: ['user.read'] };
    this.authService.acquireTokenSilent(request).subscribe({
      next: (response) => {
        const accessToken = response.accessToken;
        console.log("token", accessToken);
        this.getmoredetails(accessToken).subscribe({
          next: (userDetails) => {
            this.socketService.setNombre(userDetails.displayName)
            this.router.navigate(['/inicio']);
          },
          error: (err) => {
            console.error('Error fetching user details from Microsoft Graph:', err);
          }
        });
      },
      error: (error) => {
        console.error('Failed to acquire token', error);
        
      }
    });
  }

  getmoredetails(accessToken: string): Observable<UserDetails> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get<UserDetails>('https://graph.microsoft.com/v1.0/me?$select=displayName,jobTitle,mail,department', { headers });
  }

 
}
