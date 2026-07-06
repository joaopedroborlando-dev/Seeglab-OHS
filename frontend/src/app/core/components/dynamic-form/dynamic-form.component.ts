import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
  ],
  template: `
    <h2>{{ title }}</h2>
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <ng-content></ng-content>
      <button type="submit" class="mb-3 btn btn-light">{{ "SAVE" | translate }}</button>
      @if (onCancel) {
        <button type="button" class="mb-3 btn btn-danger" style="margin-left: 10px" (click)="onCancel()">{{ "CANCEL" | translate }}</button>
      }
    </form>
  `,
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  @Input() title: string = "";
  @Input() formGroup !: FormGroup;
  @Input() onCreate!: () => Promise<void>;
  @Input() onCancel?: () => void;

  async onSubmit(): Promise<void> {
    if (this.onCreate) await this.onCreate();
  }
}
