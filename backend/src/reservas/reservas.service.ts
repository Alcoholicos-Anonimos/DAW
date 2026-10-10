import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Reserva } from './reserva.entity.js';
import { Medico } from '../medicos/medicos.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { CrearReservaDTO } from './dto/crear-reserva.dto.js';
import { EstadosReservas } from '../common/enums/estados-reservas.enum.js';
import { EstadosUsuarios } from '../common/enums/estados-usuarios.enum.js';
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
    // 0. Permiso primero: un paciente solo puede sacar turnos para sí mismo
    if (
      usuarioSolicitante?.rol === RolesUsuarios.PACIENTE &&
      usuarioSolicitante?.id !== dto.id_paciente
    ) {
      throw new ForbiddenException('Un paciente solo puede reservar turnos para sí mismo');
    }

    const fechaTurno = new Date(dto.fecha_hora);
    const ahora = new Date();

    // 1. Validar que no sea en el pasado
    if (fechaTurno.getTime() <= ahora.getTime()) {
      throw new BadRequestException('No se pueden reservar turnos en fechas u horas pasadas');
    }

    // 2. Validar ventana de reserva: máximo 30 días de anticipación (hasta fin del día)
    const limite30Dias = new Date();
    limite30Dias.setDate(limite30Dias.getDate() + 30);
    limite30Dias.setHours(23, 59, 59, 999);
    if (fechaTurno > limite30Dias) {
      throw new BadRequestException('No se pueden reservar turnos con más de 30 días de anticipación');
    }

    // 3. Validar horarios: bloques cerrados de 1h entre 08:00 y 16:00 (último turno a las 15:00)
    // Se usa la hora local del servidor (Argentina). Enviar la fecha sin Z: YYYY-MM-DDTHH:mm:ss
    const hora = fechaTurno.getHours();
    const minutos = fechaTurno.getMinutes();
    const segundos = fechaTurno.getSeconds();

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

    // 4c. Solo los usuarios activos pueden operar en el sistema
    if (paciente.estado !== EstadosUsuarios.ACTIVO) {
      throw new BadRequestException('El paciente debe estar activo para reservar un turno');
    }

    // 5. Validar que el médico exista y obtener su valor de consulta actual
    const medico = await this.medicoRepo.findOne({
      where: { id: dto.id_medico },
      relations: { usuario: true },
    });
    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    if (!medico.usuario || medico.usuario.estado !== EstadosUsuarios.ACTIVO) {
      throw new BadRequestException('El médico debe estar activo para recibir turnos');
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
      throw new ConflictException('El horario seleccionado ya no está disponible');
    }

    // 6b. Validar que el paciente no tenga otro turno ACTIVO en esa misma fecha y hora
    const turnoPaciente = await this.reservaRepo.findOne({
      where: {
        paciente: { id: paciente.id } as any,
        fechaHora: fechaTurno,
        estado: EstadosReservas.ACTIVO,
      },
    });

    if (turnoPaciente) {
      throw new BadRequestException('El paciente ya tiene un turno reservado en ese horario');
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

    // Permiso primero: un paciente solo puede cancelar sus propias reservas
    if (
      usuarioSolicitante?.rol === RolesUsuarios.PACIENTE &&
      reserva.paciente?.id !== usuarioSolicitante?.id
    ) {
      throw new ForbiddenException('No podés cancelar la reserva de otro paciente');
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

  /**
   * Reservas ACTIVAS de un médico en una fecha (horarios ocupados).
   * Las reservas CANCELADO no bloquean el horario.
   */
  async listarReservasPorFecha(fecha: string, idMedico: number): Promise<Reserva[]> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new BadRequestException('La fecha debe tener formato YYYY-MM-DD');
    }
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const desde = new Date(anio, mes - 1, dia, 0, 0, 0);
    const hasta = new Date(anio, mes - 1, dia, 23, 59, 59);

    return await this.reservaRepo.find({
      where: {
        medico: { id: idMedico } as any,
        estado: EstadosReservas.ACTIVO,
        fechaHora: Between(desde, hasta),
      },
      order: { fechaHora: 'ASC' },
    });

    
    
  }
}