
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsuariosService {
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
}