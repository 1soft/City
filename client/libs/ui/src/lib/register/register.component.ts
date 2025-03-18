import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@client/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { SharedMatComponent } from '../shared-mat-ui.module';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ui-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [SharedMatComponent, MatRadioGroup, MatRadioButton] 
})
export class RegisterComponent {
  private builder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router = inject(Router);

  registerform = this.builder.group({
    name: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
    gender: this.builder.control('male'),
    role: this.builder.control(''),
    isactive: this.builder.control(false)
  });

  proceedregister() {
    if (this.registerform.valid) {
      this.authService.register(this.registerform.value.email, this.registerform.value.password).subscribe(result => {
        this.router.navigate(['login'])
      });
    } else {
      console.log("error in registration service");
    }
  }

}