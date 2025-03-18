import { NgModule } from '@angular/core';
import { MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatCardHeader,
    MatCardContent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    MatIconModule
  ],
  exports: [
    CommonModule,
    MatCardModule,
    MatCardHeader,
    MatCardContent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule
  ]
})
export class SharedMatComponent {}
