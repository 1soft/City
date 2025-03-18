import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '@client/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ManagerService {
  http = inject(HttpClient);
  router = inject(Router);
  auth = inject(AuthService);
  snack = inject(MatSnackBar);


  getrole() {
    return "admin";
  }
  isloggedin() {
    const token = localStorage.getItem("token");
  }
}
