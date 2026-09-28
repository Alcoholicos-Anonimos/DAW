import { ApiProperty } from "@nestjs/swagger";
import { EstadosReservas } from "../../common/enums/estados-reservas.enum.js";

export class MedicoListaReservasDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    idMedico!: number;

    @ApiProperty()
    idPaciente!: number;

    @ApiProperty()
    estado!: EstadosReservas;


    @ApiProperty()
    fechaHora: Date;

    @ApiProperty()
    valorConsulta: number;
}