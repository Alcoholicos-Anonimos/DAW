import { ApiProperty } from '@nestjs/swagger';
import { RolesUsuarios } from '../../common/enums/roles-usuarios.enum.js';

export class MedicoResponseDTO {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'García' })
  apellidos!: string;

  @ApiProperty({ example: 'Juan' })
  nombres!: string;

  @ApiProperty({ example: 12345 })
  matricula!: number;

  @ApiProperty({ example: 15000, description: 'Valor de consulta vigente (lo consume el frontend)' })
  valor_consulta!: number;

  @ApiProperty({
    example: {
      id: 1,
      nombres: 'AA',
      apellidos: 'Adam',
      email: 'grupoaa@correo.com',
      documento: '123456',
      rol: 'MEDICO'
    }
  })
  usuario: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    documento: string;
    rol: RolesUsuarios;
  };
}