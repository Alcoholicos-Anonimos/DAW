import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CrearReservaDTO {
  @ApiProperty({ example: 1, description: 'ID del médico' })
  @IsInt({ message: 'El id_medico debe ser un número entero' })
  @IsNotEmpty({ message: 'El id_medico es requerido' })
  id_medico: number;

  @ApiProperty({ example: 1, description: 'ID del paciente' })
  @IsInt({ message: 'El id_paciente debe ser un número entero' })
  @IsNotEmpty({ message: 'El id_paciente es requerido' })
  id_paciente: number;

  @ApiProperty({ 
    example: '2026-09-20T10:00:00.000Z', 
    description: 'Fecha y hora del turno en formato ISO' 
  })
  @IsDateString({}, { message: 'La fecha y hora debe ser un string ISO 8601 válido' })
  @IsNotEmpty({ message: 'La fecha y hora es requerida' })
  fecha_hora: string;
}