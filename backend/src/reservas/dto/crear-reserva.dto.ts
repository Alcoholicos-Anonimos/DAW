
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, Min, IsString, IsIn } from 'class-validator';
import { EstadosReservas } from '../../common/enums/estados-reservas.enum.js';

export class CrearReservaDTO {
  @ApiProperty({ example: 1, description: 'ID del médico' })
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del médico es requerido' })
  @Min(1, { message: 'El ID del médico debe ser mayor a 0' })
  id_medico: number;

 @ApiProperty({ example: 1, description: 'ID del paciente' })
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del paciente es requerido' })
  @Min(1, { message: 'El ID del paciente debe ser mayor a 0' })
  id_paciente: number;
  
  @ApiProperty({ 
    example: '2026-09-15T10:00:00.000Z', 
    description: 'Fecha y hora de la reserva (ISO 8601)' 
  })
  
  @IsDateString({}, { message: 'La fecha debe ser un string ISO 8601 válido' })
  @IsNotEmpty({ message: 'La fecha y hora son requeridas' })
  fecha_hora: string;
  
   @IsString()
  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsIn(Object.values(EstadosReservas), { 
    message: `El estado debe ser uno de: ${Object.values(EstadosReservas).join(', ')}` 
  })
  estado!: EstadosReservas;
  
   @ApiProperty()
   valor_consulta!: number;
}