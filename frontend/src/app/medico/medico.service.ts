import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadosReservas } from '../shared/estados-reservas.enum';

/** Estados a los que el médico puede pasar un turno ACTIVO. */
export type EstadoMarcable = EstadosReservas.ATENDIDO | EstadosReservas.AUSENTE;

export interface PacienteTurno {
  id: number;
  documento: string;
  apellidos: string;
  nombres: string;
}

/** Turno tal como lo devuelve GET /medicos/lista-turnos (reserva + paciente). */
export interface TurnoAgenda {
  id: number;
  fechaHora: string;
  estado: EstadosReservas;
  valorConsulta: number;
  paciente: PacienteTurno;
}

/** Respuesta de POST /medicos/marcar-turno. */
export interface MarcarTurnoRespuesta {
  reserva: TurnoAgenda;
  estado: EstadosReservas;
}

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  /** Turnos del médico logueado para un día (formato YYYY-MM-DD). */
  listaTurnos(fecha: string): Observable<TurnoAgenda[]> {
    return this.httpClient.get<TurnoAgenda[]>('/api/v1/medicos/lista-turnos', {
      params: { fecha },
    });
  }

  marcarTurno(idReserva: number, estado: EstadoMarcable): Observable<MarcarTurnoRespuesta> {
    return this.httpClient.post<MarcarTurnoRespuesta>('/api/v1/medicos/marcar-turno', {
      id_reserva: idReserva,
      estado,
    });
  }
}
