import { Post, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from '../auth/dto/login.dto.js';
import { UsuariosService } from './usuarios.service.js';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {

    constructor(private usuarioService: UsuariosService){}

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión como usuario' })
    @ApiBody({ type: LoginDTO })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async login(@Body() loginDto: LoginDTO) {
        return this.usuarioService.Login(loginDto.email, loginDto.clave);
    }
}
