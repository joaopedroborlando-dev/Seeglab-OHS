import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import IHazardInventoryDto from '../../../core/http/dtos/IHazardInventoryDto';
import IEpiDeliveryDto, { IEpiDeliveryItemDto } from '../../../core/http/dtos/IEpiDeliveryDto';

@Component({
  selector: 'app-epi-delivery',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './epi-delivery.component.html',
  styleUrl: './epi-delivery.component.scss'
})
export class EpiDeliveryComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  toastService: ToastService = inject(ToastService);

  inventories: IHazardInventoryDto[] = [];
  employeesWithWorkUnits: any[] = [];
  recommendedEpis: any[] = [];

  formGroup = new FormGroup({
    inventoryId: new FormControl<number | null>(null),
    employeeId: new FormControl<number | null>(null),
    workUnitId: new FormControl<number | null>(null),
    notes: new FormControl<string>(''),
    deliveredAt: new FormControl<string>(new Date().toISOString().substring(0, 10)),
    items: new FormArray([])
  });

  get itemsFormArray() {
    return this.formGroup.get('items') as FormArray;
  }

  async ngOnInit(): Promise<void> {
    await this.fetchInventories();

    this.formGroup.get('inventoryId')?.valueChanges.subscribe(invId => {
      if (invId) {
        this.fetchContext(invId);
      } else {
        this.employeesWithWorkUnits = [];
        this.formGroup.get('employeeId')?.setValue(null);
      }
    });

    this.formGroup.get('employeeId')?.valueChanges.subscribe(empId => {
      this.updateWorkUnitSelection(empId);
    });

    this.formGroup.get('workUnitId')?.valueChanges.subscribe(wuId => {
      if (wuId) {
        this.fetchRecommendations(wuId);
      } else {
        this.recommendedEpis = [];
        this.itemsFormArray.clear();
      }
    });
  }

  async fetchInventories() {
    try {
      const res = await this.apiService.postData<any>("pgr/inventory/find-all", { page: 1, limit: 100 });
      this.inventories = res.data || [];
      if (this.inventories.length > 0) {
        const activeInv = this.inventories.find((i: any) => i.status === 'ACTIVE') || this.inventories[0];
        this.formGroup.get('inventoryId')?.setValue(activeInv.id ?? null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async fetchContext(inventoryId: number) {
    try {
      this.employeesWithWorkUnits = await this.apiService.getData<any>(`epi/delivery/context`, { inventoryId });
      // Reset subsequent fields
      this.formGroup.get('employeeId')?.setValue(null);
      this.formGroup.get('workUnitId')?.setValue(null);
    } catch (error) {
      this.toastService.error("FAILED_TO_LOAD_DATA");
    }
  }

  updateWorkUnitSelection(employeeId: number | null) {
    if (!employeeId) {
      this.formGroup.get('workUnitId')?.setValue(null);
      return;
    }
    const empContext = this.employeesWithWorkUnits.filter(e => e.employeeId === employeeId);
    if (empContext.length === 1) {
      this.formGroup.get('workUnitId')?.setValue(empContext[0].workUnitId);
    } else {
      this.formGroup.get('workUnitId')?.setValue(null);
    }
  }

  get availableWorkUnitsForEmployee() {
    const empId = this.formGroup.get('employeeId')?.value;
    if (!empId) return [];
    return this.employeesWithWorkUnits.filter(e => e.employeeId === empId);
  }

  get uniqueEmployees() {
    const uniqueMap = new Map();
    for (const ctx of this.employeesWithWorkUnits) {
      if (!uniqueMap.has(ctx.employeeId)) {
        uniqueMap.set(ctx.employeeId, { id: ctx.employeeId, name: ctx.employeeName });
      }
    }
    return Array.from(uniqueMap.values());
  }

  async fetchRecommendations(workUnitId: number) {
    try {
      this.recommendedEpis = await this.apiService.getData<any>(`epi/delivery/recommendations`, { workUnitId });
      this.buildItemsForm(this.recommendedEpis);
    } catch (error) {
      this.toastService.error("FAILED_TO_LOAD_DATA");
    }
  }

  buildItemsForm(epis: any[]) {
    this.itemsFormArray.clear();
    epis.forEach(epi => {
      this.itemsFormArray.push(new FormGroup({
        epiId: new FormControl(epi.epiId),
        epiName: new FormControl(epi.epiName),
        caAtDelivery: new FormControl(epi.caNumber || ''),
        quantity: new FormControl(1),
        size: new FormControl(''),
      }));
    });
  }

  addExtraEpi() {
    this.itemsFormArray.push(new FormGroup({
      epiId: new FormControl(null),
      epiName: new FormControl('EPI Extra'),
      caAtDelivery: new FormControl(''),
      quantity: new FormControl(1),
      size: new FormControl(''),
    }));
  }

  removeItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  async submitDelivery() {
    const vals = this.formGroup.value;
    if (!vals.employeeId || !vals.workUnitId || this.itemsFormArray.length === 0) {
      this.toastService.error("FILL_REQUIRED_FIELDS");
      return;
    }

    const payload: IEpiDeliveryDto = {
      employeeId: vals.employeeId,
      workUnitId: vals.workUnitId,
      deliveredAt: new Date(vals.deliveredAt!),
      notes: vals.notes || undefined,
      items: this.itemsFormArray.value.map((item: any) => {
        // Calculate expiresAt +30 days for now, ideally backend calculates or we fetch lifespan
        const expires = new Date(vals.deliveredAt!);
        expires.setDate(expires.getDate() + 30);

        return {
          epiId: item.epiId,
          caAtDelivery: item.caAtDelivery,
          quantity: item.quantity,
          size: item.size,
          expiresAt: expires
        } as IEpiDeliveryItemDto;
      })
    };

    try {
      await this.apiService.postData("epi/delivery/create", payload);
      this.toastService.success("DELIVERY_SAVED");
      this.formGroup.reset();
      this.itemsFormArray.clear();
      this.formGroup.get('deliveredAt')?.setValue(new Date().toISOString().substring(0, 10));
    } catch (error) {
      this.toastService.error("FAILED_TO_SAVE");
    }
  }
}
