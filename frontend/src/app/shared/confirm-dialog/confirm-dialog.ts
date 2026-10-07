import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmacionData {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialog {
  readonly data: ConfirmacionData = inject(MAT_DIALOG_DATA);

  readonly dialogRef: MatDialogRef<ConfirmDialog, boolean> = inject(MatDialogRef);
}
