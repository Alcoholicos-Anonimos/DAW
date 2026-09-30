import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity.js';
import { Medico } from '../medicos/medicos.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { CrearReservaDTO } from './dto/crear-reserva.dto.js';
import { EstadosReservas } from '../common/enums/estados-reservas.enum.js';
import { RolesUsuarios } from '../common/enums/roles-usuarios.enum.js';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Medico)
    private readonly medicoRepo: Repository<Medico>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  /**
   * Crear una reserva aplicando todas las reglas de negocio
   */
  async crearReserva(dto: CrearReservaDTO, usuarioSolicitante: any): Promise<Reserva> {
    const fechaTurno = new Date(dto.fecha_hora);
    const ahora = new Date();

    // 1. Validar que no sea en el pasado
    if (fechaTurno.getTime() <= ahora.getTime()) {
      throw new BadRequestException('No se pueden reservar turnos en fechas u horas pasadas');
    }

    // 2. Validar ventana de reserva: máximo 30 días de anticipación
    const limite30Dias = new Date();
    limite30Dias.setDate(ahora.getDate() + 30);
    if (fechaTurno > limite30Dias) {
      throw new BadRequestException('No se pueden reservar turnos con más de 30 días de anticipación');
    }

    // 3. Validar horarios: bloques cerrados de 1h entre 08:00 y 16:00 (último turno a las 15:00)
    const hora = fechaTurno.getUTCHours();
    const minutos = fechaTurno.getUTCMinutes();
    const segundos = fechaTurno.getUTCSeconds();

    if (minutos !== 0 || segundos !== 0) {
      throw new BadRequestException('Los turnos deben comenzar en punto (ej: 08:00, 09:00)');
    }

    if (hora < 8 || hora > 15) {
      throw new BadRequestException('El horario de atención es de 08:00 a 16:00 (último turno a las 15:00)');
    }

    // 4. Validar que el paciente exista
    const paciente = await this.usuarioRepo.findOne({ where: { id: dto.id_paciente } });
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // 4b. Validar que el usuario sea realmente un paciente
    if (paciente.rol !== RolesUsuarios.PACIENTE) {
      throw new BadRequestException('El usuario indicado no es un paciente');
    }

    // Si el que llama es un paciente, solo puede sacar turnos para sí mismo
    if (
      usuarioSolicitante?.rol === RolesUsuarios.PACIENTE &&
      usuarioSolicitante?.id !== dto.id_paciente
    ) {
      throw new ForbiddenException('Un paciente solo puede reservar turnos para sí mismo');
    }

    // 5. Validar que el médico exista y obtener su valor de consulta actual
    const medico = await this.medicoRepo.findOne({ where: { id: dto.id_medico } });
    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    // 6. Validar no solapamiento: que el médico no tenga ya un turno ACTIVO en esa fecha y hora
    const turnoExistente = await this.reservaRepo.findOne({
      where: {
        medico: { id: medico.id } as any,
        fechaHora: fechaTurno,
        estado: EstadosReservas.ACTIVO,
      },
    });

    if (turnoExistente) {
      throw new BadRequestException('El médico ya tiene un turno reservado en ese horario');
    }

    // 7. Congelar el valor de consulta y guardar la reserva
    const valorConsultaMedico = (medico as any).valorConsulta ?? (medico as any).valor_consulta ?? 0;

    const nuevaReserva = this.reservaRepo.create({
      fechaHora: fechaTurno,
      estado: EstadosReservas.ACTIVO,
      valorConsulta: valorConsultaMedico,
      medico,
      paciente,
    });

    return await this.reservaRepo.save(nuevaReserva);
  }

  /**
   * Cancelar un turno aplicando las reglas según el rol
   */
  async cancelarReserva(idReserva: number, usuarioSolicitante: any): Promise<Reserva> {
    const reserva = await this.reservaRepo.findOne({
      where: { id: idReserva },
      relations: { paciente: true },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado !== EstadosReservas.ACTIVO) {
      throw new BadRequestException(`No se puede cancelar una reserva con estado ${reserva.estado}`);
    }

    const ahora = new Date();
    const fechaTurno = new Date(reserva.fechaHora);

    // Regla Administrador: puede cancelar hasta el momento de inicio de la consulta
    if (usuarioSolicitante?.rol === RolesUsuarios.ADMINISTRADOR) {
      if (ahora >= fechaTurno) {
        throw new BadRequestException('La consulta ya ha comenzado; no se puede cancelar');
      }
    } 
    // Regla Paciente: puede cancelar solo hasta el día anterior
    else if (usuarioSolicitante?.rol === RolesUsuarios.PACIENTE) {
      if (reserva.paciente?.id !== usuarioSolicitante?.id) {
        throw new ForbiddenException('No podés cancelar la reserva de otro paciente');
      }

      // Comparar fechas a nivel día calendario
      const fechaDiaTurno = new Date(fechaTurno.getFullYear(), fechaTurno.getMonth(), fechaTurno.getDate());
      const fechaDiaHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

      const diferenciaMilisegundos = fechaDiaTurno.getTime() - fechaDiaHoy.getTime();
      const diasDeDiferencia = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

      if (diasDeDiferencia < 1) {
        throw new BadRequestException('Los pacientes solo pueden cancelar turnos hasta el día anterior');
      }
    } else {
      throw new ForbiddenException('Rol no autorizado para cancelar reservas');
    }

    reserva.estado = EstadosReservas.CANCELADO;
    return await this.reservaRepo.save(reserva);
  }

  /**
   * Listar reservas según el rol del usuario que consulta
   */
  async listarReservas(usuarioSolicitante: any): Promise<Reserva[]> {
    if (usuarioSolicitante?.rol === RolesUsuarios.ADMINISTRADOR) {
      return await this.reservaRepo.find({
        relations: {
          medico: { usuario: true },
          paciente: true,
        },
        order: { fechaHora: 'ASC' },
      });
    }

    if (usuarioSolicitante?.rol === RolesUsuarios.PACIENTE) {
      return await this.reservaRepo.find({
        where: { paciente: { id: usuarioSolicitante.id } } as any,
        relations: {
          medico: { usuario: true },
        },
        order: { fechaHora: 'ASC' },
      });
    }

    return [];
  }
}