import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

const CLASE_POR_ESTADO: Record<string, string> = {
  ACTIVO: 'chip-activo',
  ATENDIDO: 'chip-atendido',
  AUSENTE: 'chip-ausente',
  CANCELADO: 'chip-cancelado',
};

@Component({
  selector: 'app-estado-chip',
  templateUrl: './chip-estado.html',
  styleUrl: './chip-estado.css',
  imports: [MatChipsModule],
})
export class ChipEstado {
  readonly estado = input.required<string>();

  readonly clase = computed(() => CLASE_POR_ESTADO[this.estado()] ?? '');
}
