import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth/auth.interceptor';

// Firebase imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCVVPNLKKYmhz99B3rJPPqKarHzekpD8e0",
  authDomain: "medicall-15e2c.firebaseapp.com",
  databaseURL: "https://medicall-15e2c.firebaseio.com",
  projectId: "medicall-15e2c",
  storageBucket: "medicall-15e2c.appspot.com",
  messagingSenderId: "396361313952",
  appId: "1:396361313952:web:161334f02e871c2ae323c5",
	measurementId: "G-SZZEHRQJGY"
  
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};
