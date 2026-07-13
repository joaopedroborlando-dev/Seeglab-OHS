import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-drawer.component.html',
  styleUrl: './side-drawer.component.scss'
})
export class SideDrawerComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');

  closed = output<void>();

  close() {
    this.closed.emit();
  }
}
