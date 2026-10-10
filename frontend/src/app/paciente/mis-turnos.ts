import { Component, inject, ViewChild, AfterViewInit, signal, Signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ChipEstado } from '../shared/chip-estado/chip-estado';
import { PacienteService } from "../services/paciente.service";
import { MonedaPipe } from '../shared/pipes/moneda.pipe';
import { EstadosReservas } from '../shared/estados-reservas.enum';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from '@angular/material/divider';
import { AuthStore } from "../auth/auth-store";
import { MatPaginator } from '@angular/material/paginator';

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
        MatCardModule,
        MatSelectModule,
        MatDividerModule,
        FormsModule,
        ChipEstado,
        MonedaPipe,
        ConfirmDialog
    ]
})
export class MisTurnos {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    private pacienteService = inject(PacienteService);
    titulo = signal('Mis turnos');
    turnos = new MatTableDataSource<any>([]);
    estados = ['TODOS', ...Object.values(EstadosReservas)];
    selectedValue = 'TODOS';
    todosLosTurnos: any[] = [];
    private dialog = inject(MatDialog);

    private readonly authStore = inject(AuthStore);
    readonly esAdmin = this.authStore.obtenerRol() === 'ADMINISTRADOR';
    readonly columnas: string[] = this.esAdmin
        ? ['fechaHora', 'paciente', 'medico', 'valorConsulta', 'estado', 'accion']
        : ['fechaHora', 'medico', 'valorConsulta', 'estado', 'accion'];

    ngOnInit(): void {
        this.buscarTurnos();
        if (this.esAdmin) {
            this.titulo.set('Turnos de pacientes');
        } else {
            this.titulo.set('Mis turnos');
        }
    }

    ngAfterViewInit(): void {
        this.turnos.paginator = this.paginator;
    }
    buscarTurnos() {
        this.pacienteService.getTurnos().subscribe((data: any) => {
            this.todosLosTurnos = data;
            this.filtrarTurnos();
        });
    }

    filtrarTurnos() {
        if (this.selectedValue === 'TODOS') {
            this.turnos.data = this.todosLosTurnos;
        } else {
            this.turnos.data = this.todosLosTurnos.filter(
                t => t.estado === this.selectedValue
            );
        }

        this.turnos.paginator?.firstPage();
    }

    puedeCancelarPaciente(t: any): boolean {
        if (t.estado !== 'ACTIVO') return false;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const turno = new Date(t.fechaHora);
        turno.setHours(0, 0, 0, 0);

        return turno.getTime() > hoy.getTime();
    }

    confirmarCancelar(t: any) {

        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: {
                titulo: 'Cancelar turno',
                mensaje: '¿Está seguro de que desea cancelar este turno?',
                textoConfirmar: 'Sí, cancelar',
                textoCancelar: 'No'
            }
        });

        dialogRef.afterClosed().subscribe((confirmado) => {

            if (confirmado) {
                this.pacienteService.cancelarReserva(t.id).subscribe(() => {
                    this.buscarTurnos();
                });
            }

        });
    }
}