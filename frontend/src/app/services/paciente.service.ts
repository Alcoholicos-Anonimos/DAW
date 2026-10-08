import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {

    private readonly httpClient: HttpClient = inject(HttpClient)

   getTurnos(): Observable<any> {
    return this.httpClient.get<any>('reservas');
  }

  
}
