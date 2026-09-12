import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MedicosService } from './medicos.service.js';
import { Medico } from './medicos.entity.js';
import { MedicosController } from './medicos.controller.js';

@Module({
   imports: [
    TypeOrmModule.forFeature(
      [Medico]
    )],

  providers: [MedicosService],
  controllers: [MedicosController],
  exports: [MedicosService],
})
export class MedicosModule {}