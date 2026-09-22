import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { EstadosReservas } from '../../common/enums/estados-reservas.enum.js';

export class ActualizarReservaDTO {
  @ApiProperty({ example: 1, description: 'ID de la reserva a marcar' })
  @IsInt()
  @IsNotEmpty({ message: 'El id de la reserva es requerido' })
  id_reserva: number;

  @ApiProperty({ 
    enum: EstadosReservas,
    example: 'ATENDIDO',
    description: 'Nuevo estado de la reserva'
  })
  @IsString()
  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsIn(Object.values(EstadosReservas), { 
    message: `El estado debe ser uno de: ${Object.values(EstadosReservas).join(', ')}` 
  })
  estado: EstadosReservas;
}