import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { Exclude } from 'class-transformer';
import { EstadosUsuarios } from '../common/enums/estados-usuarios.enum.js';
import { RolesUsuarios } from '../common/enums/roles-usuarios.enum.js';
import { Medico } from '../medicos/medicos.entity.js';
import { Reserva } from '../reservas/reserva.entity.js';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  documento: string;

  @Column()
  apellidos: string;

  @Column()
  nombres: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  clave: string;

  @Column({
    type: 'enum',
    enum: EstadosUsuarios,
    enumName: 'estados_usuarios',
  })
  estado: EstadosUsuarios;

  @Column({
    type: 'enum',
    enum: RolesUsuarios,
    enumName: 'roles_usuarios',
  })
  rol: RolesUsuarios;

  @OneToOne(() => Medico, (medico) => medico.usuario)
  medico?: Relation<Medico>;

  @OneToMany(() => Reserva, (reserva) => reserva.paciente)
  reservas?: Relation<Reserva>[];
}