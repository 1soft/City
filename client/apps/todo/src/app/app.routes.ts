import { Route } from '@angular/router';
import { AuthPageComponent } from '../components/pages/auth/auth.component';
import { RegisterComponent } from '@client/ui';
import { TasksComponent } from '../components/pages/tasks/tasks.component';
import { AuthGuard } from '../guards/tasks.guard';

export const appRoutes: Route[] = [
    { path: 'login', component: AuthPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'tasks' }
];