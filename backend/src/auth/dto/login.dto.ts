
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'grupoaa@correo.com',
    description: 'Email del usuario'
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    example: '1234',
    description: 'Contraseña del usuario'
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  clave: string;
}