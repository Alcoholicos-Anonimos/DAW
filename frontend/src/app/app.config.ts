import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth-interceptor';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { FechaArgentinaAdapter } from './shared/fecha-argentina.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter({
      ...MAT_NATIVE_DATE_FORMATS,
      display: {
        ...MAT_NATIVE_DATE_FORMATS.display,
        dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
      },
    }),
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: DateAdapter, useClass: FechaArgentinaAdapter },
  ]
};
