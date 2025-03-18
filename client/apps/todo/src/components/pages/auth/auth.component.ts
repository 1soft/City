import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginComponent } from '@client/ui';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent],
  templateUrl: './auth.component.html'
})
export class AuthPageComponent {}
