import { Component, inject, Input } from '@angular/core';
import { DynamicFormComponent } from '../../../../../core/components/dynamic-form/dynamic-form.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IHazardInventory } from '../../../../../core/models/interfaces/IHazardInventory';
import { ApiService } from '../../../../../core/services/api.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-create-hazard-inventory',
  imports: [
    DynamicFormComponent,
    TranslatePipe,
    ReactiveFormsModule
  ],
  template: `
    <app-dynamic-form
      [title]="'INVENTORY' | translate"
      [formGroup]="formGroup"
      [onCreate]="handleCreate.bind(this)"
      [onCancel]="changeCreateMode"
    >
      <div class="row">
        <div class="col-md-6">
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">{{ 'DESCRIPTION' | translate }}</span>
            <input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" formControlName="description">
          </div>
        </div>
      </div>
    </app-dynamic-form>
  `,
  styleUrl: './create-hazard-inventory.component.scss'
})
export class CreateHazardInventoryComponent {
  @Input() changeCreateMode!: () => void;
  // Service
  apiService: ApiService = inject(ApiService);
  router: Router = inject(Router);
  toastService: ToastService = inject(ToastService);
  translateService: TranslateService = inject(TranslateService);

  formGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
  });
  hazardInventory !: IHazardInventory;

  async handleCreate(): Promise<void> {
    if (this.formGroup.invalid) {
      this.toastService.error(this.translateService.instant('REQUIRED_FIELD'));
      return;
    }

    const inventory = await this.apiService.postData<IHazardInventory>("pgr/inventory/create", {
      description: this.formGroup.get("description")?.value
    })
    if (inventory != null && inventory.id) {
      await this.router.navigate(['/department-inclusion', inventory.id]);
    }
  }

}
