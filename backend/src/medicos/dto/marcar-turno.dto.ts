import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsEnum, IsNotEmpty } from 'class-validator';
import { EstadosReservas } from '../../common/enums/estados-reservas.enum.js';

export class MarcarTurnoDTO {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  idReserva: number;

  @ApiProperty({ enum: EstadosReservas, example: EstadosReservas.ATENDIDO })
  @IsEnum(EstadosReservas)
  @IsNotEmpty()
  estado: EstadosReservas;
}