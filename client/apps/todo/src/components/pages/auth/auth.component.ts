import { Component } from '@angular/core';
import { LoginComponent } from '@client/ui';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './auth.component.html'
})
export class AuthPageComponent {}
