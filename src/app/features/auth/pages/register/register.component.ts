import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

// Validador personalizado: ambas contraseñas deben coincidir
const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pass    = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass && confirm && pass !== confirm
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);

  loading        = false;
  showPassword   = false;
  errorMessage   = '';
  successMessage = '';

  registerForm: FormGroup = this.fb.group(
    {
      displayName:     ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator }
  );

  /** Calcula la fortaleza de la contraseña en tiempo real */
  get passwordStrength(): { class: string; label: string; width: string } {
    const pass: string = this.registerForm.get('password')?.value ?? '';
    let score = 0;
    if (pass.length >= 8)              score++;
    if (/[A-Z]/.test(pass))            score++;
    if (/[0-9]/.test(pass))            score++;
    if (/[^A-Za-z0-9]/.test(pass))     score++;

    if (score <= 1) return { class: 'weak',   label: 'Débil',   width: '30%'  };
    if (score <= 2) return { class: 'medium', label: 'Media',   width: '65%'  };
    return              { class: 'strong', label: 'Fuerte',  width: '100%' };
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;

    this.loading        = true;
    this.errorMessage   = '';
    this.successMessage = '';

    const { email, password, displayName } = this.registerForm.value;

    try {
      await firstValueFrom(
        this.authService.registerWithEmail(email, password, displayName)
      );

      // Firebase autentica automáticamente al crear el usuario.
      // Hacemos logout para que el usuario deba ingresar sus credenciales en el login.
      await this.authService.logout();

      this.successMessage = '¡Cuenta creada con éxito! Ahora inicia sesión con tus credenciales.';

      // Redirección al login tras 2 segundos para que lea el mensaje
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);

    } catch (error: any) {
      console.error('Firebase error completo:', error);
      console.error('Código de error:', error?.code);
      this.errorMessage = this.mapFirebaseError(error?.code);
    } finally {
      this.loading = false;
    }
  }

  /** Convierte los códigos de error de Firebase a mensajes amigables en español */
  private mapFirebaseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/email-already-in-use':    'Este correo ya está registrado. Intenta iniciar sesión.',
      'auth/invalid-email':           'El correo ingresado no es válido.',
      'auth/weak-password':           'La contraseña es muy débil. Usa al menos 8 caracteres.',
      'auth/network-request-failed':  'Sin conexión a internet. Verifica tu red.',
      'auth/too-many-requests':       'Demasiados intentos. Inténtalo más tarde.',
    };
    return errors[code] ?? 'Ocurrió un error al crear la cuenta. Inténtalo de nuevo.';
  }
}
