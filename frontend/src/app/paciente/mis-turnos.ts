import { Component, inject } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChipEstado } from '../shared/chip-estado/chip-estado';
import { PacienteService } from "../services/paciente.service";
import { MonedaPipe } from '../shared/pipes/moneda.pipe';
@Component({
    selector: "app-mis-turnos",
    templateUrl: "./mis-turnos.html",
    styleUrl: "./mis-turnos.css",
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatTooltipModule,
        ChipEstado,
        MonedaPipe
    ]
})
export class MisTurnos {
    private pacienteService = inject(PacienteService);
    turnos = new MatTableDataSource<any>([]);

  ngOnInit(): void {
   this.buscarTurnos();
   }
 
  buscarTurnos() {  
    this.pacienteService.getTurnos().subscribe((data: any) => {
        this.turnos = data;
    }); 
  }
  
   puedeCancelarPaciente(t: any): boolean {
    if (t.estado !== 'ACTIVO') return false;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const turno = new Date(t.fechaHora);
    turno.setHours(0, 0, 0, 0);

    return turno.getTime() > hoy.getTime();
    }

    confirmarCancelar(t: any){

    }
}