import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { AsyncPipe } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-toast-container',
  imports: [
    AsyncPipe,
    TranslatePipe
],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
      @for (toast of toasts$ | async; track trackByFn($index, toast)) {
        <div
          class="toast show"
          [class.text-bg-success]="toast.type === 'success'"
          [class.text-bg-danger]="toast.type === 'error'"
          [class.text-bg-warning]="toast.type === 'warning'"
          [class.text-bg-info]="toast.type === 'info'"
          role="alert"
          aria-live="assertive"
          aria-atomic="true">
          <div class="toast-header" [class.bg-success]="toast.type === 'success'"
            [class.bg-danger]="toast.type === 'error'"
            [class.bg-warning]="toast.type === 'warning'"
            [class.bg-info]="toast.type === 'info'">
            <strong class="me-auto text-white">{{ getToastTitle(toast.type) | translate }}</strong>
            <button type="button"
              class="btn-close btn-close-white"
              (click)="closeToast(toast.id)"
            aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ toast.message | translate }}
          </div>
        </div>
      }
    </div>
    `
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts$: Observable<ToastMessage[]>;
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeToast(id: string) {
    this.toastService.remove(id);
  }

  trackByFn(index: number, toast: ToastMessage) {
    return toast.id;
  }

  getToastTitle(type: string): string {
    switch (type) {
      case 'success': return 'SUCCESS';
      case 'error': return 'ERROR';
      case 'warning': return 'WARNING';
      case 'info': return 'INFO';
      default: return 'NOTIFICATION';
    }
  }
}
