import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Reservas } from './reservas/reservas';
import { AuthGuard } from './auth/auth-guard';
import { RoleGuard } from './auth/role-guard';
import { Medicos } from './medicos/medicos';

/*
import { MisTurnos } from './paciente/mis-turnos/mis-turnos';
import { Reservar } from './reservas/reservar/reservar';
import { Agenda } from './medico/agenda/agenda';
import { Valor } from './admin/valor-consulta/valor-consulta';*/

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: 'reservas',
    component: Reservas
  },

  {
    path: 'paciente',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['PACIENTE'] },
    children: [
     /* {
        path: 'mis-turnos',
        component: MisTurnos
      },*/
      {
        path: 'reservar',
        component: Reservas
      }
    ]
  },

  {
    path: 'medico',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['MEDICO'] },
    children: [
     /* {
        path: 'agenda',
        component: Agenda
      }*/
    ]
  },

  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      {
        path: 'reservar',
        component: Reservas
      },
     /* {
        path: 'valor-consulta',
        component: Valor
      }*/
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];