import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity.js';
import { Reserva } from '../reservas/reserva.entity.js';

@Entity({ name: 'medicos' })
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  matricula: number;

  @Column({ name: 'valor_consulta' })
  valorConsulta: number;

  @OneToOne(() => Usuario, (usuario) => usuario.medico)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Relation<Usuario>;

  @Column({ name: 'id_usuario', insert: false, update: false })
  idUsuario: number;

  @OneToMany(() => Reserva, (reserva) => reserva.medico)
  reservas?: Relation<Reserva>[];
}