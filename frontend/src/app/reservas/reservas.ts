import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthStore } from '../auth/auth-store';
import { MonedaPipe } from '../shared/pipes/moneda.pipe';
import { CrearReserva, Medico, Paciente, ReservasApiClient } from './reservas-api-client';


function inicioDeDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

function sumarDias(fecha: Date, dias: number): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + dias);
}

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MonedaPipe,
  ],
})
export class Reservas {

  private readonly reservasApiClient = inject(ReservasApiClient);
  private readonly authStore = inject(AuthStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly esAdmin = this.authStore.obtenerRol() === 'ADMINISTRADOR';
  readonly horarios: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  readonly hoy = inicioDeDia(new Date());
  readonly maxFecha = sumarDias(this.hoy, 30);

  medicos: Medico[] = [];
  pacientes: Paciente[] = [];
  horasOcupadas = signal<Set<string>>(new Set());
  horaSeleccionada = signal<string | null>(null);
  enviando = false;

  readonly form = new FormGroup({
    medico: new FormControl<number | null>(null, Validators.required),
    paciente: new FormControl<number | null>(null, this.esAdmin ? [Validators.required] : []),
    fecha: new FormControl<Date | null>(this.hoy, Validators.required),
  });

  ngOnInit(): void {
    this.reservasApiClient.listarMedicos().subscribe((medicos) => (this.medicos = medicos));

    if (this.esAdmin) {
      this.reservasApiClient.listarPacientes().subscribe((pacientes) => (this.pacientes = pacientes));
    }

    this.form.get('medico')?.valueChanges.subscribe(() => this.consultarOcupados());
    this.form.get('fecha')?.valueChanges.subscribe(() => this.consultarOcupados());
  }

  get medicoSeleccionado(): Medico | null {
    const idMedico = this.form.value.medico;
    return this.medicos.find((medico) => medico.id === idMedico) ?? null;
  }

  get pacienteSeleccionado(): Paciente | null {
    const idPaciente = this.form.value.paciente;
    return this.pacientes.find((paciente) => paciente.id === idPaciente) ?? null;
  }

  get resumenMedico(): string {
    const medico = this.medicoSeleccionado;
    return medico ? `Dr. ${medico.nombres} ${medico.apellidos}` : '—';
  }

  get resumenPaciente(): string {
    const paciente = this.pacienteSeleccionado;
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : '—';
  }

  horarioDeshabilitado(horario: string): boolean {
    return this.horasOcupadas().has(horario);
  }

  seleccionarHora(horario: string): void {
    if (this.horarioDeshabilitado(horario)) {
      return;
    }

    this.horaSeleccionada.set(this.horaSeleccionada() === horario ? null : horario);
  }

  reservar(): void {
    const medico = this.medicoSeleccionado;
    const fecha = this.form.value.fecha;
    const hora = this.horaSeleccionada();
    const idPaciente = this.esAdmin ? this.form.value.paciente : this.authStore.obtenerId();

    if (this.form.invalid || !medico || !fecha || !hora || !idPaciente || this.enviando) {
      return;
    }

    const reserva: CrearReserva = {
      id_medico: medico.id,
      id_paciente: idPaciente,
      fecha_hora: `${this.formatearFecha(fecha)}T${hora}:00`,
      valor_consulta: medico.valor_consulta,
    };

    this.enviando = true;

    this.reservasApiClient.crearReserva(reserva).subscribe({
      next: () => {
        this.snackBar.open('Turno reservado correctamente.', 'Cerrar', { duration: 5000 });
        this.router.navigateByUrl(this.rutaTurnos());
      },
      error: (error) => {
        this.enviando = false;

        if (error.status === 409) {
          this.snackBar.open('El horario seleccionado ya no está disponible.', 'Cerrar', { duration: 5000 });
          this.horaSeleccionada.set(null);
          this.consultarOcupados();
          return;
        }

        this.snackBar.open(this.mensajeDeError(error), 'Cerrar', { duration: 5000 });
      },
    });
  }

   consultarOcupados(): void {
    
    const idMedico = this.form.value.medico;
    const fecha = this.form.value.fecha;

    if (!idMedico || !fecha) {
      this.horasOcupadas.set(new Set());
      this.horaSeleccionada.set(null);
      return;
    }

    this.reservasApiClient.listarOcupados(this.formatearFecha(fecha), idMedico).subscribe((reservas) => {
        this.horasOcupadas.set(
        new Set(reservas.map((r) => this.horaDeReserva(r.fechaHora))),
      );

      const hora = this.horaSeleccionada();
      if (hora && this.horarioDeshabilitado(hora)) {
        this.horaSeleccionada.set(null);
      }
    });
  }

  private horarioYaPaso(horario: string): boolean {
    const fecha = this.form.value.fecha;

    if (!fecha) {
      return false;
    }

    const [hora, minutos] = horario.split(':').map(Number);
    const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), hora, minutos);

    return inicio.getTime() <= Date.now();
  }

  private horaDeReserva(fechaHora: string): string {
    const fecha = new Date(fechaHora);
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${hora}:${minutos}`;
  }

  private formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  private rutaTurnos(): string {
    return this.esAdmin ? '/admin/mis-turnos' : '/paciente/mis-turnos';
  }

  private mensajeDeError(error: any): string {
    const mensaje = error?.error?.message;

    if (Array.isArray(mensaje)) {
      return mensaje.join(' ');
    }

    if (typeof mensaje === 'string' && mensaje.trim()) {
      return mensaje;
    }

    return 'No se pudo reservar el turno. Intente nuevamente.';
  }
}
