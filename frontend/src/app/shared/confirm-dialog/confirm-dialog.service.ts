import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { ConfirmacionData, ConfirmDialog } from './confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly dialog: MatDialog = inject(MatDialog);

  confirmar(data: ConfirmacionData): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialog, { data, width: '420px' })
      .afterClosed()
      .pipe(map((resultado) => resultado === true));
  }
}
