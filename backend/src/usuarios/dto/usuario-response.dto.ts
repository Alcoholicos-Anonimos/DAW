
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UsuarioResponseDTO {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '123456' })
  documento: string;

  @ApiProperty({ example: 'Adam' })
  apellidos: string;

  @ApiProperty({ example: 'AA' })
  nombres: string;

  @ApiProperty({ example: 'grupoaa@correo.com' })
  email: string;

  @ApiProperty({ example: 'ACTIVO' })
  estado: string;

  @ApiProperty({ example: 'ADMINISTRADOR' })
  rol: string;

  @Exclude()
  clave: string; // Nunca se devuelve en la respuesta
}