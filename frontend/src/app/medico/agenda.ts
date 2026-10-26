import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  MatDateFormats,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { filter, finalize, switchMap } from 'rxjs';
import { ChipEstado } from '../shared/chip-estado/chip-estado';
import { ConfirmDialogService } from '../shared/confirm-dialog/confirm-dialog.service';
import { EmptyState } from '../shared/empty-state/empty-state';
import { EstadosReservas } from '../shared/estados-reservas.enum';
import { EstadoMarcable, MedicoService } from './medico.service';
import { TurnoAgenda } from '../shared/interfaces' 
// Fecha en el campo como dd/mm/aaaa (el formato por defecto muestra d/m/aaaa).
const FORMATO_FECHA: MatDateFormats = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
  },
};

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
  providers: [
    provideNativeDateAdapter(FORMATO_FECHA),
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
  ],
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ChipEstado,
    EmptyState,
  ],
})
export class Agenda implements OnInit {
  private readonly medicoService: MedicoService = inject(MedicoService);
  private readonly confirmDialog: ConfirmDialogService = inject(ConfirmDialogService);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  protected readonly Estados = EstadosReservas;
  protected readonly columnas = ['hora', 'paciente', 'acciones'];

  protected readonly fecha = new FormControl<Date | null>(new Date());

  protected readonly turnos = signal<TurnoAgenda[]>([]);
  protected readonly cargando = signal(false);
  /** Id del turno que se está marcando, para bloquear sus botones mientras tanto. */
  protected readonly procesando = signal<number | null>(null);

  ngOnInit(): void {
    this.buscarTurnos();
  }

  protected buscarTurnos(): void {
    const fecha = this.fechaIso();

    if (!fecha) {
      this.turnos.set([]);
      return;
    }

    this.cargando.set(true);

    this.medicoService.listaTurnos(fecha).subscribe({
      next: (turnos) => {
        // Si mientras tanto eligió otro día, esta respuesta ya no corresponde.
        if (fecha !== this.fechaIso()) return;

        this.turnos.set(this.ordenarPorHora(turnos));
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (fecha !== this.fechaIso()) return;

        this.turnos.set([]);
        this.cargando.set(false);
        this.avisar(this.mensajeDeError(err, 'No se pudieron cargar los turnos.'));
      },
    });
  }

  protected irAHoy(): void {
    this.fecha.setValue(new Date());
    this.buscarTurnos();
  }

  protected marcar(turno: TurnoAgenda, estado: EstadoMarcable): void {
    const atendido = estado === EstadosReservas.ATENDIDO;
    const paciente = `${turno.paciente.nombres} ${turno.paciente.apellidos}`;
    const hora = formatDate(turno.fechaHora, 'HH:mm', 'en-US');

    this.confirmDialog
      .confirmar({
        titulo: atendido ? 'Marcar como atendido' : 'Marcar como ausente',
        mensaje: `¿Confirmás marcar como ${atendido ? 'atendido' : 'ausente'} el turno de ${paciente} de las ${hora}?`,
        textoConfirmar: 'Sí, confirmar',
        textoCancelar: 'Volver',
      })
      .pipe(
        filter((confirmado) => confirmado),
        switchMap(() => {
          this.procesando.set(turno.id);
          return this.medicoService.marcarTurno(turno.id, estado);
        }),
        finalize(() => this.procesando.set(null)),
      )
      .subscribe({
        next: (respuesta) => {
          this.turnos.update((lista) =>
            lista.map((t) => (t.id === turno.id ? { ...t, estado: respuesta.estado } : t)),
          );
          this.avisar(`Turno de ${paciente} marcado como ${atendido ? 'atendido' : 'ausente'}.`);
        },
        error: (err: HttpErrorResponse) => {
          this.avisar(this.mensajeDeError(err, 'No se pudo actualizar el turno.'));
          // 409: el turno ya no estaba ACTIVO; se recarga para mostrar su estado real.
          if (err.status === 409 || err.status === 404) this.buscarTurnos();
        },
      });
  }

  /** Día elegido como YYYY-MM-DD (el formato que espera la API), en hora local. */
  private fechaIso(): string | null {
    const fecha = this.fecha.value;

    if (!fecha) return null;

    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

  private ordenarPorHora(turnos: TurnoAgenda[]): TurnoAgenda[] {
    return [...turnos].sort(
      (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
    );
  }

  /** La API devuelve { message } con un texto o, si falla la validación, una lista. */
  private mensajeDeError(err: HttpErrorResponse, porDefecto: string): string {
    const mensaje = err.error?.message;

    if (Array.isArray(mensaje)) return mensaje.join('. ');

    return typeof mensaje === 'string' ? mensaje : porDefecto;
  }

  private avisar(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
  }
}
