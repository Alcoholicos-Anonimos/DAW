
import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservas } from '../../common/enums/estados-reservas.enum.js';
import { formatearFechaLocal } from '../../common/fecha-local.js';
import { Transform } from 'class-transformer';

export class ReservaResponseDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2026-09-15T10:00:00' })
   @Transform(({ value }) =>
    value instanceof Date ? formatearFechaLocal(value) : value,
  )
  fechaHora: string;

  @ApiProperty({ enum: EstadosReservas, example: 'ACTIVO' })
  estado: EstadosReservas;

  @ApiProperty({ example: 15000 })
  valorConsulta: number;

  @ApiProperty({
    example: {
      id: 1,
      matricula: 12345,
      valorConsulta: 15000,
      usuario: {
        id: 1,
        nombres: 'AA',
        apellidos: 'Adam',
        email: 'grupoaa@correo.com'
      }
    }
  })
  medico: {
    id: number;
    matricula: number;
    valorConsulta: number;
    usuario: {
      id: number;
      nombres: string;
      apellidos: string;
      email: string;
    };
  };

  @ApiProperty({
    example: {
      id: 2,
      nombres: 'BB',
      apellidos: 'Paciente',
      email: 'paciente@correo.com'
    }
  })
  paciente: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
}