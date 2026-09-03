
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateValorConsultaDTO {
  @ApiProperty({ 
    example: 20000, 
    description: 'Nuevo valor de la consulta' 
  })
  @IsNumber({}, { message: 'El valor debe ser un número' })
  @IsNotEmpty({ message: 'El valor es requerido' })
  @Min(0, { message: 'El valor debe ser mayor o igual a 0' })
  valorConsulta: number;
}