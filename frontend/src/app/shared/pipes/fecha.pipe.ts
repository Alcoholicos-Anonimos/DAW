import { Pipe, PipeTransform } from '@angular/core';

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

@Pipe({
  name: 'fecha',
})
export class FechaPipe implements PipeTransform {
  transform(valor: string | Date | null | undefined): string {
    if (!valor) {
      return '';
    }

    const fecha = typeof valor === 'string' ? new Date(valor) : valor;

    if (isNaN(fecha.getTime())) {
      return '';
    }

    const dia = DIAS_SEMANA[fecha.getDay()];
    const diaMes = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia} ${diaMes}/${mes}/${anio} · ${horas}:${minutos}`;
  }
}
