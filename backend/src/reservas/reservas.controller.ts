import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ReservasService } from './reservas.service.js';
import { CrearReservaDTO } from './dto/crear-reserva.dto.js';
import { ReservaResponseDTO } from './dto/reserva-response.dto.js';

@ApiTags('Reservas')
@ApiBearerAuth()
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  /**
   * Crear una nueva reserva (Pacientes o Administradores)
   */
  @Post()
  @ApiOperation({ summary: 'Crear una reserva respetando reglas de horario y anticipación' })
  @ApiCreatedResponse({ type: ReservaResponseDTO, description: 'Reserva creada con éxito' })
  async crearReserva(
    @Body() dto: CrearReservaDTO,
    @Req() req: any,
  ) {
    // Si aún no tenés activo el guard de JWT, podés simular el usuario desde req.user
    const usuarioSolicitante = req.user ?? { id: dto.id_paciente, rol: 'PACIENTE' };
    return await this.reservasService.crearReserva(dto, usuarioSolicitante);
  }

  /**
   * Listar reservas del paciente o todas si es administrador
   */
  @Get()
  @ApiOperation({ summary: 'Listar reservas según el rol del usuario autenticado' })
  @ApiOkResponse({ type: [ReservaResponseDTO], description: 'Listado de reservas' })
  async listarReservas(@Req() req: any) {
    const usuarioSolicitante = req.user ?? { id: 1, rol: 'ADMINISTRADOR' };
    return await this.reservasService.listarReservas(usuarioSolicitante);
  }

  /**
   * Cancelar una reserva
   */
  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar reserva cumpliendo políticas de tiempo según rol' })
  @ApiOkResponse({ type: ReservaResponseDTO, description: 'Reserva cancelada' })
  async cancelarReserva(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const usuarioSolicitante = req.user ?? { id: 1, rol: 'ADMINISTRADOR' };
    return await this.reservasService.cancelarReserva(id, usuarioSolicitante);
  }
}