import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Agenda } from './agenda';
import { TurnoAgenda } from './medico.service';
import { ConfirmDialogService } from '../shared/confirm-dialog/confirm-dialog.service';
import { EstadosReservas } from '../shared/estados-reservas.enum';

function turno(id: number, hora: number, estado: EstadosReservas, nombres: string): TurnoAgenda {
  const fechaHora = new Date(2026, 9, 7, hora, 0, 0).toISOString();

  return {
    id,
    fechaHora,
    estado,
    valorConsulta: 5000,
    paciente: { id: id + 100, documento: `3000${id}`, apellidos: 'Pérez', nombres },
  };
}

describe('Agenda del médico', () => {
  let fixture: ComponentFixture<Agenda>;
  let http: HttpTestingController;
  let confirmar: ReturnType<typeof vi.fn>;
  let snackBar: { open: ReturnType<typeof vi.fn> };

  const el = (): HTMLElement => fixture.nativeElement;
  const filas = (): HTMLElement[] => Array.from(el().querySelectorAll('mat-row'));
  const hoyIso = (): string => {
    const h = new Date();
    return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`;
  };

  async function cargar(turnos: TurnoAgenda[]): Promise<void> {
    http.expectOne(`/api/v1/medicos/lista-turnos?fecha=${hoyIso()}`).flush(turnos);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    confirmar = vi.fn().mockReturnValue(of(true));
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Agenda],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmDialogService, useValue: { confirmar } },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Agenda);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('pide los turnos del día de hoy al abrirse', async () => {
    await cargar([]);
  });

  it('lista los turnos ordenados por hora con nombre y DNI del paciente', async () => {
    await cargar([
      turno(2, 11, EstadosReservas.ACTIVO, 'Julia'),
      turno(1, 9, EstadosReservas.ATENDIDO, 'Carlos'),
    ]);

    const filasTexto = filas().map((f) => f.textContent ?? '');

    expect(filasTexto).toHaveLength(2);
    expect(filasTexto[0]).toContain('Carlos Pérez');
    expect(filasTexto[0]).toContain('DNI 30001');
    expect(filasTexto[1]).toContain('Julia Pérez');
  });

  it('muestra los botones solo en los turnos ACTIVO', async () => {
    await cargar([
      turno(1, 9, EstadosReservas.ATENDIDO, 'Carlos'),
      turno(2, 10, EstadosReservas.ACTIVO, 'Ana'),
      turno(3, 13, EstadosReservas.AUSENTE, 'Mateo'),
      turno(4, 14, EstadosReservas.CANCELADO, 'Lucía'),
    ]);

    const botones = filas().map((f) => f.querySelectorAll('button').length);

    expect(botones).toEqual([0, 2, 0, 0]);
  });

  it('muestra "Sin turnos este día" cuando no hay turnos', async () => {
    await cargar([]);

    expect(filas()).toHaveLength(0);
    expect(el().textContent).toContain('Sin turnos este día');
  });

  it('al confirmar, marca el turno como atendido y actualiza la fila', async () => {
    await cargar([turno(7, 10, EstadosReservas.ACTIVO, 'Ana')]);

    const atendido = el().querySelectorAll<HTMLButtonElement>('mat-row button')[0];
    expect(atendido.textContent).toContain('Marcar atendido');
    atendido.click();

    const req = http.expectOne('/api/v1/medicos/marcar-turno');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ id_reserva: 7, estado: 'ATENDIDO' });
    req.flush({ reserva: {}, estado: 'ATENDIDO' });
    await fixture.whenStable();

    expect(confirmar).toHaveBeenCalledTimes(1);
    expect(filas()[0].textContent).toContain('ATENDIDO');
    expect(filas()[0].querySelectorAll('button')).toHaveLength(0);
    expect(snackBar.open).toHaveBeenCalledWith(
      expect.stringContaining('atendido'),
      'Cerrar',
      expect.anything(),
    );
  });

  it('marca como ausente con el estado AUSENTE', async () => {
    await cargar([turno(8, 11, EstadosReservas.ACTIVO, 'Julia')]);

    el().querySelectorAll<HTMLButtonElement>('mat-row button')[1].click();

    const req = http.expectOne('/api/v1/medicos/marcar-turno');
    expect(req.request.body).toEqual({ id_reserva: 8, estado: 'AUSENTE' });
    req.flush({ reserva: {}, estado: 'AUSENTE' });
    await fixture.whenStable();
  });

  it('si el médico no confirma, no llama a la API', async () => {
    confirmar.mockReturnValue(of(false));
    await cargar([turno(9, 10, EstadosReservas.ACTIVO, 'Ana')]);

    el().querySelectorAll<HTMLButtonElement>('mat-row button')[0].click();
    await fixture.whenStable();

    http.expectNone('/api/v1/medicos/marcar-turno');
  });

  it('ante un 409 avisa el motivo y recarga la lista', async () => {
    await cargar([turno(5, 10, EstadosReservas.ACTIVO, 'Ana')]);

    el().querySelectorAll<HTMLButtonElement>('mat-row button')[0].click();

    http
      .expectOne('/api/v1/medicos/marcar-turno')
      .flush(
        { statusCode: 409, message: 'Solo se puede modificar una reserva en estado ACTIVO' },
        { status: 409, statusText: 'Conflict' },
      );

    expect(snackBar.open).toHaveBeenCalledWith(
      'Solo se puede modificar una reserva en estado ACTIVO',
      'Cerrar',
      expect.anything(),
    );

    await cargar([turno(5, 10, EstadosReservas.ATENDIDO, 'Ana')]);
    expect(filas()[0].querySelectorAll('button')).toHaveLength(0);
  });
});
