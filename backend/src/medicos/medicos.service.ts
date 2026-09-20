import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './medicos.entity.js';
import { EstadosReservas } from '../common/enums/estados-reservas.enum.js';
import { Reserva } from '../reservas/reserva.entity.js';

@Injectable()
export class MedicosService {

    constructor(@InjectRepository(Medico) private medicoRepositorio: Repository<Medico>,
        @InjectRepository(Reserva) private reservaRepositorio: Repository<Reserva>) { }

    async findById(id: number): Promise<Medico | null> {
        const medico = await this.medicoRepositorio.findOne({
            where: { id },  
        });
        return medico;
    }

    async listaTurnos(id_usuario: number, fecha: Date) : Promise<Reserva[]> {
       const medico = await this.medicoRepositorio.findOne({
            where: { idUsuario: id_usuario },
            relations: { 
                reservas: //trae ademas las reservas asociadas al medico
                { paciente: true}}, // Trae ademas los pacientes de esas reservas
            select:{
                    id: true,
                    idUsuario: true,
                    reservas : {
                        estado: true,
                        paciente: true,
                        fechaHora: true,
                        valorConsulta: true
                    }
                }   
            });

        if (!medico) {
            throw new HttpException('Médico no encontrado', HttpStatus.NOT_FOUND);
        }

        return (medico.reservas ?? []).filter(
            reserva => reserva.fechaHora.toDateString() === fecha.toDateString()
        );
    }

    async marcarTurno(id_Usuario: number, id_reserva: number, estado: EstadosReservas): Promise<boolean> {
        // Instancio el medico
        const medico : Medico = this.medicoRepositorio.create({ idUsuario: id_Usuario });

        //Busco su reserva por id
        const reserva = medico?.reservas?.find(reserva => reserva.id === id_reserva);
        if (!reserva) {
            throw new HttpException('Reserva no encontrada', HttpStatus.NOT_FOUND);
        }

        if(reserva.estado === EstadosReservas.ATENDIDO || reserva.estado === EstadosReservas.AUSENTE || reserva.estado === EstadosReservas.CANCELADO){ 
            return false; //solo puedo cambiar la reserva si esta en estado ACTIVO
        }

        if(reserva.estado === EstadosReservas.ACTIVO)
        {
            if(estado === EstadosReservas.ATENDIDO) reserva.estado = EstadosReservas.ATENDIDO;
            else  if(estado === EstadosReservas.AUSENTE) reserva.estado = EstadosReservas.AUSENTE;
                else return false; //solo puedo cambiar la reserva a ATENDIDO o AUSENTE
        }
        // Guardo los cambios
        await this.medicoRepositorio.save(medico);
        return true;
    }

}
