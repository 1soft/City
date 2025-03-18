import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@client/core';
import { SharedMatComponent } from '../shared-mat-ui.module';
import { FormValidators } from '@client/utils';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ui-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [SharedMatComponent]
})
export class LoginComponent {
  private builder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);

  loginform = this.builder.group({
    email: this.builder.control('', FormValidators.email),
    password: this.builder.control('', Validators.compose([FormValidators.required, FormValidators.strongPassword]))
  });

  proceedlogin() {
    if (this.loginform.valid) {
      this.authService.login(this.loginform.value.email, this.loginform.value.password, "/tasks").subscribe(item => {
        console.log(item);
      });
    } else {
    }
  }
}