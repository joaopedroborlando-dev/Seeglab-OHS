import { ApplicationRef, ComponentRef, createComponent, inject, Injectable, OutputRefSubscription } from '@angular/core';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalComponentRef: ComponentRef<ConfirmationModalComponent> | null = null;
  private applicationRef: ApplicationRef = inject(ApplicationRef);
  private subscription: OutputRefSubscription | null = null;

  open(title: string, message: string, confirmText: string, cancelText: string): Promise<boolean> {
    if (!this.modalComponentRef) {
      this.modalComponentRef = createComponent(ConfirmationModalComponent, {
        environmentInjector: this.applicationRef.injector
      });
    }

    this.modalComponentRef.instance.title.set(title);
    this.modalComponentRef.instance.message.set(message);
    this.modalComponentRef.instance.confirmText.set(confirmText);
    this.modalComponentRef.instance.cancelText.set(cancelText);

    this.applicationRef.attachView(this.modalComponentRef.hostView);

    document.body.appendChild(this.modalComponentRef.location.nativeElement);

    this.modalComponentRef.changeDetectorRef.detectChanges();
    return new Promise<boolean>((resolve) => {
      this.subscription = this.modalComponentRef!.instance.confirmed.subscribe((result) => {
        this.closeModal();
        resolve(result);
      });
    });
  }

  closeModal() {
    this.subscription?.unsubscribe();
    this.subscription = null;

    if (this.modalComponentRef) {
      this.applicationRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.location.nativeElement.remove();
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }

}
