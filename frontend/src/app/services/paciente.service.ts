import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly httpClient: HttpClient = inject(HttpClient)

  getTurnos(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/reservas');
  }

  cancelarReserva(turnoId: number): Observable<any> {
    return this.httpClient.patch<any>(`/api/v1/reservas/${turnoId}/cancelar`, {});
  }

}
