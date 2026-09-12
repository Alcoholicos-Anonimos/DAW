import { Body, Controller, NotImplementedException, Post , Get, Req} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse , ApiOperation, ApiResponse} from "@nestjs/swagger";
import { MedicosService } from "./medicos.service.js";
import { Medico } from "./medicos.entity.js";
import { EstadosReservas } from "../common/enums/estados-reservas.enum.js";
import { Reserva } from "../reservas/reserva.entity.js";

@Controller("/medicos")
export class MedicosController {

    constructor(private medicosService: MedicosService) { }
/** Médicos: pueden ver sus turnos reservados dada una fecha y marcar un turno como atendido o ausente. */
   

    @Get("lista-turnos")
    @ApiBearerAuth() //Se usa para que requiera el token de autenticación en la documentación de Swagger
    @ApiOperation({ summary: 'Lista de turnos del medico que lo solicito', }) //descripcion que sale en swagger
    @ApiBody({ type: Date, description: 'Fecha para filtrar los turnos' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de turnos del medico',
        schema: {
            example: {
                type: 'array',
                reservas: {    
                    reserva1:{
                        id_reserva: 1,
                        id_medico: 1,
                        id_paciente: 1,
                        fecha_hora: '2023-06-01T10:00:00Z',
                        estado: 'ACTIVO',
                        valor_consulta: 100.0
                    },
                    reserva2:{
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
    async listaTurnos(@Req() req: any, @Body() fecha: Date) : Promise<Medico['reservas']> {
        const id_Usuario = req.user?.id;
        return await this.medicosService.listaTurnos(id_Usuario, fecha);
    }
  
    @Post("marcar-turno")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Medico: Marcar turno como atendido o ausente' })
    @ApiBody({ description: 'ID de la reserva a marcar', type: Number })
    @ApiBody({ description: 'Nuevo estado de la reserva',  enum: EstadosReservas }) 
    @ApiOkResponse({ description: 'Resultado de la operación', type: Boolean })
    async marcarTurno(@Req() req: any,@Body() id_reserva: number, @Body() estado: EstadosReservas) : Promise<boolean> {
        const id_Usuario = req.user?.id;
        return await this.medicosService.marcarTurno(id_Usuario,id_reserva, estado);
    }

}