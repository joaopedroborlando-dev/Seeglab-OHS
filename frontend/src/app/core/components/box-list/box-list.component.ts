import { Component, EventEmitter, Input, Output } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  imports: [
    TranslatePipe
],
  styleUrls: ['./box-list.component.scss']
})
export class BoxListComponent {
  @Input() items: any[] = [];
  @Input() title: string = "";
  @Input() bindLabel: string = "description";
  @Output() add = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  selectedItemIndex: number = -1;

  constructor() { }

  ngOnInit(): void {}

  addItem(): void {
    this.add.emit();
  }

  removeItem(): void {
    if (this.selectedItemIndex >= 0) {
      this.remove.emit(this.items[this.selectedItemIndex]);
      this.selectedItemIndex = -1;
    }
  }

  selectItem(index: number): void {
    this.selectedItemIndex = index === this.selectedItemIndex ? -1 : index;
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
