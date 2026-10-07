import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDTO } from './dto/login.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ 
    status: 200, 
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIs...',
        usuario: {
          id: 1,
          email: 'grupoaa@correo.com',
          nombres: 'AA',
          apellidos: 'Adam',
          rol: 'ADMINISTRADOR',
          documento: '123456'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 403, description: 'Usuario inactivo' })
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }
}