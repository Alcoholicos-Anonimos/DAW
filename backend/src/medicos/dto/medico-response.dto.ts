
import { ApiProperty } from '@nestjs/swagger';
import { EstadosUsuarios } from '../../common/enums/estados-usuarios.enum.js';
import { RolesUsuarios } from '../../common/enums/roles-usuarios.enum.js';

export class MedicoResponseDTO {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 12345 })
  matricula!: number;

  @ApiProperty({ example: 15000 })
  valorConsulta!: number;

  @ApiProperty({
    example: {
      id: 1,
      nombres: 'AA',
      apellidos: 'Adam',
      email: 'grupoaa@correo.com',
      documento: '123456',
      clave: '1234',
      estado: 'ACTIVO',
      rol: 'MEDICO'
    }
  })
  usuario: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    documento: string;
    clave: string;
    estado: EstadosUsuarios;
    rol: RolesUsuarios;
  };
}