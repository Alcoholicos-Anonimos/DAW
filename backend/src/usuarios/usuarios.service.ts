
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';

@Injectable()

/* Enunciado:
  Se debe proporcionar credenciales validas de unusuario activo para iniciar sesion.
  En esta etapa únicamente se consultan dichos datos para validar el inicio de
  sesión de los usuarios y las funcionalidades habilitadas según el rol
*/
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario) private usuarioRepositorio: Repository<Usuario>) { }


  async findByEmail(email: string) {
    // Temporal: solo admin para pruebas
    if (email === 'grupoaa@correo.com') {
      return {
        id: 1,
        email: 'grupoaa@correo.com',
        clave: '1234',
        estado: 'ACTIVO',
        rol: 'ADMINISTRADOR',
        nombres: 'AA',
        apellidos: 'Adam',
        documento: '123456'
      };
    }
    return null;
  }

  async Login(email: string, clave: string) {
    const usuario = await this.usuarioRepositorio.findOneBy( {
        email,
        clave
    })
    
    if (!usuario || usuario.estado !== 'ACTIVO') {  
      return null;
    }
    return usuario;
  }

}