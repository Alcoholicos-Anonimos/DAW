import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MedicosService } from './medicos.service.js';
import { Medico } from './medicos.entity.js';
import { Reserva } from '../reservas/reserva.entity.js'
import { MedicosController } from './medicos.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
   imports: [
    AuthModule,
    TypeOrmModule.forFeature(
      [Medico, Reserva]
    )],

  providers: [MedicosService],
  controllers: [MedicosController],
  exports: [MedicosService],
})
export class MedicosModule {}