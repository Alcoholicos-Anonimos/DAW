import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity.js';
import { Medico } from '../medicos/medicos.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { ReservasService } from './reservas.service.js';
import { ReservasController } from './reservas.controller.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Reserva, Medico, Usuario])],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}