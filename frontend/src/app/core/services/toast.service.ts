import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', delay: number = 5000) {
    const toast: ToastMessage = {
      id: this.generateId(),
      message,
      type,
      delay
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remove toast after delay
    if (delay > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, delay);
    }
  }

  remove(id: string) {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  clear() {
    this.toastsSubject.next([]);
  }

  // Convenience methods
  success(message: string, delay?: number) {
    this.show(message, 'success', delay);
  }

  error(message: string, delay?: number) {
    this.show(message, 'error', delay);
  }

  warning(message: string, delay?: number) {
    this.show(message, 'warning', delay);
  }

  info(message: string, delay?: number) {
    this.show(message, 'info', delay);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
