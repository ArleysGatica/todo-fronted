import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { TodoListComponent } from './features/todos/pages/todo-list/todo-list.component';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'auth/login',    component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { 
    path: 'todos', 
    component: TodoListComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
