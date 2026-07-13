import { Component, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [TranslatePipe],
  template: `
    <div class="modal-backdrop" (click)="dismiss()"></div>
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h5 class="modal-title">{{ title() | translate}}</h5>
      </div>
      <div class="modal-body">
        {{ message() | translate}}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="dismiss()">
          {{ cancelText() | translate }}
        </button>
        <button type="button" class="btn btn-primary" (click)="confirm()">
          {{ confirmText() | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1050;
    }

    .modal-box {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      z-index: 1051;
      width: 500px;
      max-width: 90vw;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .modal-header {
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
    }

    .modal-body {
      padding: 1rem;
    }

    .modal-footer {
      padding: 1rem;
      border-top: 1px solid #dee2e6;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `],
})
export class ConfirmationModalComponent {
  title = signal('CONFIRM');
  message = signal('ARE_YOU_SURE');
  confirmText = signal('CONFIRM');
  cancelText = signal('CANCEL');
  confirmed = output<boolean>();

  confirm() {
    this.confirmed.emit(true);
  }

  dismiss() {
    this.confirmed.emit(false);
  }
}
