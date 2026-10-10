import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { EstadosReservas } from '../common/enums/estados-reservas.enum.js';
import { Medico } from '../medicos/medicos.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';


@Entity({ name: 'reservas' })
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fecha_hora', type: 'timestamp without time zone', })
  fechaHora: Date;

  @Column({
    type: 'enum',
    enum: EstadosReservas,
    enumName: 'estados_reservas',
  })
  estado: EstadosReservas;

  @Column({ name: 'valor_consulta' })
  valorConsulta: number;

  @ManyToOne(() => Medico, (medico) => medico.reservas)
  @JoinColumn({ name: 'id_medico' })
  medico: Relation<Medico>;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
  @JoinColumn({ name: 'id_paciente' })
  paciente: Relation<Usuario>;
}