import { Component, inject, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MedicoService } from "./medico.service";
import { MonedaPipe } from "../shared/pipes/moneda.pipe";
import { FormControl, FormRecord, ReactiveFormsModule, Validators } from "@angular/forms";
import { Medico } from  '../shared/interfaces';

@Component({
  selector: 'app-valor-consulta',
  templateUrl: './valor-consulta.html',
  styleUrl: './valor-consulta.css',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MonedaPipe,
  ],
})
export class ValorConsulta implements OnInit {
  private readonly medicoService = inject(MedicoService);

  readonly medicos = signal<Medico[]>([]);
  protected readonly columnas = ['medico', 'valor_consulta', 'nuevoValor', 'acciones'];

  // Un control por médico, con el id como clave
  protected readonly valores = new FormRecord<FormControl<number | null>>({});

  ngOnInit(): void {
    this.cargarMedicos();
  }

  protected control(id: number): FormControl<number | null> {
    return this.valores.controls[id];
  }

  private cargarMedicos(): void {
    this.medicoService.listarMedicos().subscribe((medicos) => {
      for (const m of medicos) {
        if (!this.valores.contains(String(m.id))) {
          this.valores.addControl(
            String(m.id),
            new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
          );
        }
      }
      this.medicos.set(medicos);
    });
  }

  protected guardar(medico: Medico): void {
    const ctrl = this.control(medico.id);

    if (ctrl.invalid || ctrl.value == null) {
      ctrl.markAsTouched();
      return;
    }

    this.medicoService
      .actualizarValorConsulta(medico.id, ctrl.value)
      .subscribe(() => {
        ctrl.reset();
        this.cargarMedicos();
      });
  }
}