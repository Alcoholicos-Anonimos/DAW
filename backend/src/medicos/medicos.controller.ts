import { Body, Controller, Post, Get, Req, UseGuards, Query, HttpCode, Patch, Param, ParseIntPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { MedicosService } from "./medicos.service.js";
import { MedicoResponseDTO } from './dto/medico-response.dto.js';


import { Reserva } from "../reservas/reserva.entity.js";
import { ActualizarReservaDTO } from "../reservas/dto/actualizar-reserva.dto.js";

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesUsuarios } from '../common/enums/roles-usuarios.enum.js';

import { UpdateValorConsultaDTO } from './dto/update-valor-consulta.dto.js';
import { MarcarTurnoResponseDTO } from "./dto/respueta-marcar-turno.dto.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("/medicos")
export class MedicosController {

    constructor(private medicosService: MedicosService) { }
    /** Médicos: pueden ver sus turnos reservados dada una fecha y marcar un turno como atendido o ausente. */

    @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar médicos disponibles' })
    @ApiOkResponse({ type: [MedicoResponseDTO], description: 'Listado de médicos' })
    async listarMedicos() {
        return await this.medicosService.listarMedicos();
    }

    @Roles(RolesUsuarios.ADMINISTRADOR)
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Administrador: modificar el valor de consulta de un médico' })
    @ApiBody({ type: UpdateValorConsultaDTO })
    @ApiOkResponse({ type: MedicoResponseDTO, description: 'Médico actualizado' })
    async actualizarValorConsulta(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateValorConsultaDTO,
    ) {
        return await this.medicosService.actualizarValorConsulta(id, dto.valorConsulta);
    }
    
    @Roles(RolesUsuarios.MEDICO)
    @Get("lista-turnos")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lista de turnos del medico que lo solicito' })
    @ApiQuery({ name: 'fecha', type: String, description: 'Fecha para filtrar los turnos (YYYY-MM-DD)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de turnos del medico',
        schema: {
            example: {
                type: 'array',
                reservas: {
                    reserva1: {
                        id_reserva: 1,
                        id_medico: 1,
                        id_paciente: 1,
                        fecha_hora: '2023-06-01T10:00:00Z',
                        estado: 'ACTIVO',
                        valor_consulta: 100.0
                    },
                    reserva2: {
                        id_reserva: 2,
                        id_medico: 1,
                        id_paciente: 2,
                        fecha_hora: '2023-06-01T11:00:00Z',
                        estado: 'ACTIVO',
                        valor_consulta: 100.0
                    }
                }
            }
        }
    })
    async listaTurnos(@Req() req: any, @Query('fecha') fecha: string): Promise<Reserva[]> {
        const id_Usuario = req.user.id;
        return await this.medicosService.listaTurnos(id_Usuario, fecha);
    }

    @Roles(RolesUsuarios.MEDICO)
    @Post("marcar-turno")
    @HttpCode(200)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Medico: Marcar turno como atendido o ausente' })
    @ApiBody({ type: ActualizarReservaDTO })
    @ApiOkResponse({ description: 'Resultado de la operación', type: MarcarTurnoResponseDTO  })
    async marcarTurno(@Req() req: any, @Body() dto: ActualizarReservaDTO):  Promise<MarcarTurnoResponseDTO> {
        const id_Usuario = req.user.id;
        const reserva = await this.medicosService.marcarTurno(id_Usuario, dto.id_reserva, dto.estado);
        return{
            reserva,
            estado:reserva.estado
        }
    }
}    