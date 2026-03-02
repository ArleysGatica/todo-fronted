import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  user, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  
  user$: Observable<User | null>;

  constructor() {
    this.user$ = user(this.auth);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  registerWithEmail(email: string, pass: string, displayName: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, pass)).pipe(
      switchMap(async result => {
        await updateProfile(result.user, { displayName });
        return result.user;
      })
    );
  }

  loginWithEmail(email: string, pass: string): Observable<User> {
    console.log('Iniciando sesión con Firebase para:', email);
    return from(signInWithEmailAndPassword(this.auth, email, pass)).pipe(
      map(result => result.user)
    );
  }

  logout() {
    return this.auth.signOut();
  }

  async getToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return null;
    return currentUser.getIdToken();
  }
}