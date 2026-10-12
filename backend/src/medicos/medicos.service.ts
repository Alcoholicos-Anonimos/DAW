import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './medicos.entity.js';
import { Reserva } from '../reservas/reserva.entity.js'; 
import { EstadosReservas } from '../common/enums/estados-reservas.enum.js';
import { EstadosUsuarios } from '../common/enums/estados-usuarios.enum.js';
import { MedicoResponseDTO } from './dto/medico-response.dto.js';

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

   async listarMedicos(): Promise<MedicoResponseDTO[]> {
        const medicos = await this.medicoRepositorio.find({
            where: { usuario: { estado: EstadosUsuarios.ACTIVO } },
            relations: { usuario: true },
            order: { id: 'ASC' },
        });

        return medicos.map((medico) => ({
            id: medico.id,
            matricula: medico.matricula,
            valor_consulta: medico.valorConsulta,
            apellidos: medico.usuario.apellidos,
            nombres: medico.usuario.nombres,
            usuario: {
                id: medico.usuario.id,
                nombres: medico.usuario.nombres,
                apellidos: medico.usuario.apellidos,
                email: medico.usuario.email,
                documento: medico.usuario.documento,
                rol: medico.usuario.rol,
            },
        }));
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
            relations: { reservas: { paciente: true } },
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

    async marcarTurno(id_Usuario: number, id_reserva: number, estado: EstadosReservas): Promise<Reserva> {
       
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
                   throw new HttpException( 'Solo se puede modificar una reserva en estado ACTIVO', HttpStatus.CONFLICT,  ); //solo puedo cambiar la reserva si esta en estado ACTIVO
        }

        //el unico estado que llega hasta aquie es ACTIVO
        if(estado === EstadosReservas.ATENDIDO) reserva.estado = EstadosReservas.ATENDIDO;
        else  if(estado === EstadosReservas.AUSENTE) reserva.estado = EstadosReservas.AUSENTE;
            else throw new HttpException( 'Solo se puede marcar la reserva como ATENDIDO o AUSENTE', HttpStatus.BAD_REQUEST, ); //solo puedo cambiar la reserva a ATENDIDO o AUSENTE
    
        
         return await this.reservaRepositorio.save(reserva);
    }

}
