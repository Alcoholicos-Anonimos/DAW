import { Post, Body, Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from '../auth/dto/login.dto.js';
import { UsuariosService } from './usuarios.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { PacienteResponseDTO } from './dto/paciente-response.dto.js';
import { RolesUsuarios } from '../common/enums/roles-usuarios.enum.js';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {

    constructor(private usuariosService: UsuariosService) { }

    /**
       * Listar pacientes activos (solo administrador)
       */
    @Roles(RolesUsuarios.ADMINISTRADOR)
    @Get('pacientes')
    @ApiOperation({ summary: 'Listar pacientes con estado ACTIVO' })
    @ApiOkResponse({ type: [PacienteResponseDTO], description: 'Listado de pacientes activos' })
    async listarPacientes(): Promise<PacienteResponseDTO[]> {
        return await this.usuariosService.listarPacientes();
    }
}
