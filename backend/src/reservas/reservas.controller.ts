
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe, UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ReservasService } from './reservas.service.js';
import { CrearReservaDTO } from './dto/crear-reserva.dto.js';
import { ReservaResponseDTO } from './dto/reserva-response.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesUsuarios } from '../common/enums/roles-usuarios.enum.js';
import { plainToInstance } from 'class-transformer';

@ApiTags('Reservas')
@ApiBearerAuth()
  
@UseGuards(JwtAuthGuard, RolesGuard)   

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  /**
   * Crear una nueva reserva (Pacientes o Administradores)
   */

  @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)   

  @Post()
  @ApiOperation({ summary: 'Crear una reserva respetando reglas de horario y anticipación' })
  @ApiCreatedResponse({ type: ReservaResponseDTO, description: 'Reserva creada con éxito' })
  async crearReserva(
    @Body() dto: CrearReservaDTO,
    @Req() req: any,
  ) {
    // Si aún no tenés activo el guard de JWT, podés simular el usuario desde req.user
    const usuarioSolicitante = req.user; 
    return await this.reservasService.crearReserva(dto, usuarioSolicitante);
  }

  
  /**
   * Listar reservas del paciente o todas si es administrador
   */

  @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
    
@Get()
  @ApiOperation({ summary: 'Listar reservas según el rol del usuario autenticado' })
  @ApiOkResponse({ type: [ReservaResponseDTO], description: 'Listado de reservas' })
  async listarReservas(@Req() req: any) {
    const usuarioSolicitante = req.user; 
    return await this.reservasService.listarReservas(usuarioSolicitante);
  }
  /**
   * Listar reservas del paciente o todas si es administrador.
   * Con ?fecha=YYYY-MM-DD&medico=ID devuelve los horarios ocupados del médico.
   */

  @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
    
@Get('listarReservasPorFecha')
  @ApiOperation({ summary: 'Listar reservas o consultar horarios ocupados de un médico por fecha' })
  @ApiQuery({ name: 'fecha', required: false, type: String, description: 'Fecha YYYY-MM-DD' })
  @ApiQuery({ name: 'medico', required: false, type: Number, description: 'ID del médico' })
  @ApiOkResponse({ type: [ReservaResponseDTO], description: 'Listado de reservas' })
  async listarReservasPorFecha(
    @Req() req: any,
    @Query('fecha') fecha?: string,
    @Query('medico') medico?: string,
  ) {
    const traeFecha = fecha !== undefined;
    const traeMedico = medico !== undefined;

    if (traeFecha !== traeMedico) {
      throw new BadRequestException('Se deben enviar los parámetros fecha y medico juntos');
    }

    if (traeFecha && traeMedico) {
      const idMedico = Number(medico);

      if (!Number.isInteger(idMedico)) {
        throw new BadRequestException('El parámetro medico debe ser un id numérico');
      }

      const reservas = await this.reservasService.listarReservasPorFecha(fecha as string, idMedico);
       return plainToInstance(ReservaResponseDTO, reservas);
    }
  }

  /**
   * Cancelar una reserva
   */

  @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)   // ← nueva

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar reserva cumpliendo políticas de tiempo según rol' })
  @ApiOkResponse({ type: ReservaResponseDTO, description: 'Reserva cancelada' })
  async cancelarReserva(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const usuarioSolicitante = req.user; 
    return await this.reservasService.cancelarReserva(id, usuarioSolicitante);
  }
}