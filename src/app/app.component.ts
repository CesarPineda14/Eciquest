import { Component, HostListener } from '@angular/core';
import { AuthService } from './login/AuthService.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.authService.logout();
  }
}
