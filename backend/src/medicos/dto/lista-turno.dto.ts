import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class ListaTurnosDTO {
  @ApiProperty({ example: '2026-06-01' })
  @IsDateString({}, { message: 'La fecha debe tener formato válido' })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  fecha: string;
}