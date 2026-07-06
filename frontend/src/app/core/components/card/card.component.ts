import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  template: `
    <div class="card" style="margin-bottom: 10px">
      <div class="card-body">
        @if(cardTitle){
          <h5 class="card-title" style="padding: 5px">{{cardTitle}}</h5>
        }
        <div class="row">
          <div class="col-9">
            @if(cartBodyText){
              <span>{{cartBodyText}}</span>
            }
          </div>
          @if(enableActionBtn){
            <div class="col-3" style="justify-content: flex-end;display: flex;">
              <a class="btn btn-outline-secondary" style="align-content: center; margin-right: 5px" (click)="onButtonClick()">
                <i [class]=btnIconName style="font-size: 16px"></i>
              </a>
              @if(enableDeleteBtn){
                <a class="btn btn-outline-danger" style="align-content: center;" (click)="onDeleteButtonClick()">
                  <i class="bi bi-trash-fill" style="font-size: 16px"></i>
                </a>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() cardTitle: string = "";
  @Input() cartBodyText: string = "";
  @Input() cartId: string = "";
  @Input() enableActionBtn: boolean = true;
  @Input() enableDeleteBtn: boolean = false;
  @Input() btnIconName: string = "bi bi-chevron-right";
  @Output() onAction: EventEmitter<string> = new EventEmitter();
  @Output() onDeleteAction: EventEmitter<string> = new EventEmitter();

  onButtonClick() {
    this.onAction.emit(this.cartId);
  }

  onDeleteButtonClick() {
    this.onDeleteAction.emit(this.cartId);
  }

}
