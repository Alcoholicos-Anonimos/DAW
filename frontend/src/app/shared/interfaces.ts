import { EstadosReservas } from "./estados-reservas.enum";


/** Turno tal como lo devuelve GET /medicos/lista-turnos (reserva + paciente). */
export interface TurnoAgenda {
  id: number;
  fechaHora: string;
  estado: EstadosReservas;
  valorConsulta: number;
  paciente: Paciente;
}

/** Respuesta de POST /medicos/marcar-turno. */
export interface MarcarTurnoRespuesta {
  reserva: TurnoAgenda;
  estado: EstadosReservas;
}


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