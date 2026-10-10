import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  imports: [MatIconModule],
})
export class EmptyState {
  readonly texto = input.required<string>();

  readonly icono = input('event_busy');
}
