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
    example: '2026-10-05T10:00:00', 
    description: 'Fecha y hora del turno en hora de Argentina, sin Z (YYYY-MM-DDTHH:mm:ss)' 
  })
  @IsDateString({}, { message: 'La fecha y hora debe ser un string ISO 8601 válido' })
  @IsNotEmpty({ message: 'La fecha y hora es requerida' })
  fecha_hora: string;

  @ApiProperty({ 
    example: 15000, 
    description: 'Valor de consulta vigente del médico al momento de reservar' 
  })
  @IsInt({ message: 'El valor_consulta debe ser un número entero' })
  @IsNotEmpty({ message: 'El valor_consulta es requerido' })
  valor_consulta: number;
}