
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class ReservaFechaDTO {
  @ApiProperty({ 
    example: '2026-09-15', 
    description: 'Fecha en formato YYYY-MM-DD' 
  })
  @IsDateString({}, { message: 'La fecha debe ser un string ISO 8601 válido' })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  fecha: string;
}