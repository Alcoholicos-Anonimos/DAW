import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class FechaArgentinaAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value !== 'string') {
      return super.parse(value, null);
    }

    const texto = value.trim();
    const partes = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (!partes) {
      return super.parse(texto, null);
    }

    const dia = Number(partes[1]);
    const mes = Number(partes[2]);
    const anio = Number(partes[3]);
    const fecha = new Date(anio, mes - 1, dia);

    if (
      fecha.getFullYear() !== anio ||
      fecha.getMonth() !== mes - 1 ||
      fecha.getDate() !== dia
    ) {
      return null;
    }

    return fecha;
  }
}
