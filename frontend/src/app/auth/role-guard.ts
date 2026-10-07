import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {  AuthStore } from './auth-store';

export const RoleGuard: CanActivateFn = (route) => {

  const authStore = inject(AuthStore);
  const router = inject(Router);

  const rolesPermitidos = route.data['roles'] as string[];
  const rolUsuario = authStore.obtenerRol();

  if (rolUsuario && rolesPermitidos.includes(rolUsuario)) {
    return true;
  }

  return router.createUrlTree(['/login']);
};