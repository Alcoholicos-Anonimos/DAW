import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn  } from "typeorm";
import { EstadosUsuarios } from "../common/enums/estados-usuarios.enum.js";
import { RolesUsuarios } from "../common/enums/roles-usuarios.enum.js";

@Entity({name: 'usuarios'})
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    documento: string
    
    @Column({nullable: false})
    nombres: string

    @Column({nullable: false})
    apellidos: string

    @Column({nullable: false})
    email: string

    @Column({nullable: false})
    clave: string

    @Column({nullable: false, type: 'enum', enum: ['ACTIVO', 'INACTIVO']})
    estado: EstadosUsuarios

    @Column({nullable: false, type: 'enum', enum: ['MEDICO','PACIENTE','ADMINISTRADOR']})
    rol: RolesUsuarios
}