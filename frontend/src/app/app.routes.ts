import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Reservas } from './reservas/reservas';

export const routes: Routes = [
    { path: "login", component: Login },
    { path: "reservas", component: Reservas },
    { path: "**", redirectTo: "login" }
];
