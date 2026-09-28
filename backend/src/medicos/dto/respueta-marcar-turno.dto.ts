// src/medicos/dto/marcar-turno-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Reserva } from '../../reservas/reserva.entity.js';
import { EstadosReservas } from '../../common/enums/estados-reservas.enum.js';

export class MarcarTurnoResponseDTO {
  @ApiProperty({ type: () => Reserva, description: 'Reserva actualizada' })
  reserva: Reserva;

  @ApiProperty({ enum: EstadosReservas, description: 'Nuevo estado de la reserva' })
  estado: EstadosReservas;
}