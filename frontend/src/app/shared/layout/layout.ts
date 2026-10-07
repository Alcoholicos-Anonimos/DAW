import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthStore } from '../../auth/auth-store';

interface LinkNav {
  ruta: string;
  texto: string;
}

const LINKS_POR_ROL: Record<string, LinkNav[]> = {
  PACIENTE: [
    { ruta: '/paciente/mis-turnos', texto: 'Mis turnos' },
    { ruta: '/paciente/reservar', texto: 'Reservar turno' },
  ],
  MEDICO: [{ ruta: '/medico/agenda', texto: 'Mi agenda' }],
  ADMINISTRADOR: [
    { ruta: '/admin/mis-turnos', texto: 'Turnos' },
    { ruta: '/admin/reservar', texto: 'Reservar turno' },
    { ruta: '/admin/valor-consulta', texto: 'Valor de consulta' },
  ],
};

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class Layout {
  private readonly authStore: AuthStore = inject(AuthStore);

  get nombre(): string {
    return this.authStore.obtenerNombre() ?? '';
  }

  get rol(): string {
    return this.authStore.obtenerRol() ?? '';
  }

  get links(): LinkNav[] {
    return LINKS_POR_ROL[this.rol] ?? [];
  }

  cerrarSesion(): void {
    this.authStore.cerrarSesion();
  }
}
