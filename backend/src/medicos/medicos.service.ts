import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './medicos.entity.js';
import { Reserva } from '../reservas/reserva.entity.js'; 
import { EstadosReservas } from '../common/enums/estados-reservas.enum.js';

@Injectable()
export class MedicosService {

    constructor(
        @InjectRepository(Medico) private medicoRepositorio: Repository<Medico>,
        @InjectRepository(Reserva) private reservaRepositorio: Repository<Reserva>,) { }

    async findById(id: number): Promise<Medico | null> {
        const medico = await this.medicoRepositorio.findOne({
            where: { id },  
        });
        return medico;
        
    }

    async listarMedicos(): Promise<Medico[]> {
        return await this.medicoRepositorio.find({
            relations: { usuario: true },
            order: { id: 'ASC' },
        });
    }

    async actualizarValorConsulta(id: number, nuevoValor: number): Promise<Medico> {
        const medico = await this.medicoRepositorio.findOne({ where: { id } });

        if (!medico) {
            throw new HttpException('Médico no encontrado', HttpStatus.NOT_FOUND);
        }

        medico.valorConsulta = nuevoValor;
        return await this.medicoRepositorio.save(medico);
    }

    async listaTurnos(id_usuario: number, fecha: string): Promise<Reserva[]> {
        const [y, m, d] = fecha.split('-').map(Number);
        const fechaLocal = new Date(y, m - 1, d);

        const medico = await this.medicoRepositorio.findOne({
            where: { idUsuario: id_usuario },
            relations: { reservas: true },
        });

        return (medico?.reservas ?? []).filter(reserva => {
            const r = reserva.fechaHora;
            return (
                r.getFullYear() === fechaLocal.getFullYear() &&
                r.getMonth() === fechaLocal.getMonth() &&
                r.getDate() === fechaLocal.getDate()
            );
        });
    }

    async marcarTurno(id_Usuario: number, id_reserva: number, estado: EstadosReservas): Promise<boolean> {
       
        const medico = await this.medicoRepositorio.findOne({
            where: { idUsuario: id_Usuario },
            relations: { reservas: true },
        });

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
        
        await this.reservaRepositorio.save(reserva);
        return true;
    }

}
