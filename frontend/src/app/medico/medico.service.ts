import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadosReservas } from '../shared/estados-reservas.enum';
import { Medico } from  '../shared/interfaces';
import { MarcarTurnoRespuesta, TurnoAgenda } from '../shared/interfaces';

/** Estados a los que el médico puede pasar un turno ACTIVO. */
export type EstadoMarcable = EstadosReservas.ATENDIDO | EstadosReservas.AUSENTE;

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

  listarMedicos(): Observable<Medico[]> {
    return this.httpClient.get<Medico[]>('/api/v1/medicos');
  }

  actualizarValorConsulta(medicoId: number, nuevoValor: number): Observable<any> {
    return this.httpClient.patch<any>(`/api/v1/medicos/${medicoId}`, { valorConsulta: nuevoValor });
  }
}
