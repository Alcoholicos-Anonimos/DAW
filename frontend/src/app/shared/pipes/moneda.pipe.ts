import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda',
})
export class MonedaPipe implements PipeTransform {
  private readonly formato = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  });

  transform(valor: number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    return this.formato.format(valor);
  }
}
