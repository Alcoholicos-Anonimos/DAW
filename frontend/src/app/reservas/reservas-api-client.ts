import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Medico {
  id: number;
  apellidos: string;
  nombres: string;
  matricula: number;
  valor_consulta: number;
}

export interface Paciente {
  id: number;
  apellidos: string;
  nombres: string;
  documento: string;
}

export interface ReservaOcupada {
  id: number;
  fechaHora: string;
  estado: string;
}

export interface CrearReserva {
  id_medico: number;
  id_paciente: number;
  fecha_hora: string;
  valor_consulta: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasApiClient {

  private readonly httpClient: HttpClient = inject(HttpClient);

  listarMedicos(): Observable<Medico[]> {
    return this.httpClient.get<Medico[]>('/api/v1/medicos');
  }

  listarPacientes(): Observable<Paciente[]> {
    return this.httpClient.get<Paciente[]>('/api/v1/usuarios/pacientes');
  }

  listarOcupados(fecha: string, idMedico: number): Observable<ReservaOcupada[]> {
     const url = `/api/v1/reservas/listarReservasPorFecha?fecha=${fecha}&medico=${idMedico}`;
    return this.httpClient.get<ReservaOcupada[]>(url);
  }

  crearReserva(reserva: CrearReserva): Observable<unknown> {
    return this.httpClient.post<unknown>('/api/v1/reservas', reserva);
  }

}
