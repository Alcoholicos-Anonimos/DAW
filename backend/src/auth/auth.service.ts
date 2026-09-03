import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { LoginDTO } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDTO) {
    const { email, clave } = loginDto;
    
    // Temporal: hardcodeado para pruebas
    // Luego se reemplazará con BD real
    if (email === 'grupoaa@correo.com' && clave === '1234') {
      const payload = { 
        sub: 1, 
        email: email,
        rol: 'ADMINISTRADOR' 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        usuario: {
          id: 1,
          email: 'grupoaa@correo.com',
          nombres: 'AA',
          apellidos: 'Adam',
          rol: 'ADMINISTRADOR',
          documento: '123456'
        },
      };
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }
}