import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Reservas } from './reservas/reservas';
import { AuthGuard } from './auth/auth-guard';
import { RoleGuard } from './auth/role-guard';
import { Layout } from './shared/layout/layout';
import { MisTurnos } from './paciente/mis-turnos';
import { Agenda } from './medico/agenda';
import { ValorConsulta } from './medico/valor-consulta';

/* para pantalla 5: import { Valor } from './admin/valor-consulta/valor-consulta';*/

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },
  {
    path: 'paciente',
    component: Layout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['PACIENTE'] },
    children: [
      {
        path: 'mis-turnos',
        component: MisTurnos
      },
      {
        path: 'reservar',
        component: Reservas
      }
    ]
  },

  {
    path: 'medico',
    component: Layout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['MEDICO'] },
    children: [
      {
        path: 'agenda',
        component: Agenda
      }
    ]
  },

  {
    path: 'admin',
    component: Layout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      {
        path: 'reservar',
        component: Reservas
      },
      {
        path: 'mis-turnos',
        component: MisTurnos
      }, 
      {
        path: 'valor-consulta',
        component: ValorConsulta
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];