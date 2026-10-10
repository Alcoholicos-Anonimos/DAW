import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity.js';
import { PacienteResponseDTO } from './dto/paciente-response.dto.js';
import { EstadosUsuarios } from '../common/enums/estados-usuarios.enum.js';
import { RolesUsuarios } from '../common/enums/roles-usuarios.enum.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepositorio: Repository<Usuario>,
  ) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepositorio.findOne({ where: { email } });
  }

  async listarPacientes(): Promise<PacienteResponseDTO[]> {
    const pacientes = await this.usuarioRepositorio.find({
      where: {
        rol: RolesUsuarios.PACIENTE,
        estado: EstadosUsuarios.ACTIVO,
      },
      order: { apellidos: 'ASC', nombres: 'ASC' },
    });

    return pacientes.map((paciente) => ({
      id: paciente.id,
      apellidos: paciente.apellidos,
      nombres: paciente.nombres,
      documento: paciente.documento,
    }));
  }
}