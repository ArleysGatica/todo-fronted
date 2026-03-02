import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; font-family: 'Inter', sans-serif;">
      <h1>Mis Tareas</h1>
      <p>Bienvenido, {{ (authService.user$ | async)?.email }}</p>
      <button (click)="logout()" style="padding: 0.5rem 1rem; cursor: pointer;">Cerrar Sesión</button>
      <hr>
      <p>Aquí aparecerán tus tareas...</p>
    </div>
  `
})
export class TodoListComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
