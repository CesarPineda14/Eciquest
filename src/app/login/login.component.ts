import { Component, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {

  constructor(private router: Router) { }

  redirectToInicio(){
    this.router.navigate(['/inicio'])
  }
}
