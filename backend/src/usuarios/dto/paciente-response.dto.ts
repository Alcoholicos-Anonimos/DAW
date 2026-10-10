import { ApiProperty } from '@nestjs/swagger';

export class PacienteResponseDTO {
  @ApiProperty({ example: 4 })
  id: number;

  @ApiProperty({ example: 'Pérez' })
  apellidos: string;

  @ApiProperty({ example: 'Ana' })
  nombres: string;

  @ApiProperty({ example: '34567890' })
  documento: string;
}
