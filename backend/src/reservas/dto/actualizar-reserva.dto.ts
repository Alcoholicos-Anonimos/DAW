
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { EstadosReservas } from '../../common/enums/estados-reservas.enum.js';

export class ActualizarReservaDTO {
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