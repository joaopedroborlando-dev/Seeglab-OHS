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
  employees: any[] = [];
  workUnitsByEmployee: any[] = [];
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
        this.employees = [];
        this.formGroup.get('employeeId')?.setValue(null);
      }
    });

    this.formGroup.get('employeeId')?.valueChanges.subscribe(empId => {
      console.log(`empId`, empId);
      this.updateWorkUnitSelection(empId);
    });

    this.formGroup.get('workUnitId')?.valueChanges.subscribe(wuId => {
      console.log(`wuId`, wuId);
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
        const activeInv = this.inventories[0];
        this.formGroup.get('inventoryId')?.setValue(activeInv.id ?? null);
        if (activeInv.id) {
          await this.fetchContext(activeInv.id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async fetchContext(inventoryId: number) {
    try {
      this.employees = await this.apiService.getData<any>(`epi/delivery/context`, { inventoryId });
      this.formGroup.get('employeeId')?.setValue(null);
      this.formGroup.get('workUnitId')?.setValue(null);
    } catch (error) {
      this.toastService.error("FAILED_TO_LOAD_DATA");
    }
  }

  async fetchWorkUnitByEmployeeId(employeeId: number) {
    try {
      const workUnits = await this.apiService.getData<any>(`epi/delivery/work-unit-by-employee-id`, { employeeId });
      if (Array.isArray(workUnits) && workUnits.length > 0) {
        this.workUnitsByEmployee = workUnits;
      }
    } catch (error) {
      this.toastService.error("FAILED_TO_LOAD_DATA");
    }
  }

  updateWorkUnitSelection(employeeId: number | null) {
    if (!employeeId) {
      this.formGroup.get('workUnitId')?.setValue(null);
      return;
    }
    const empContext = this.employees.find(e => e.employeeId == employeeId);
    if (empContext) {
      this.workUnitsByEmployee = [];
      this.fetchWorkUnitByEmployeeId(employeeId);
    } else {
      this.formGroup.get('workUnitId')?.setValue(null);
    }
  }

  get availableWorkUnitsForEmployee() {
    const empId = this.formGroup.get('employeeId')?.value;
    if (!empId) return [];
    return this.workUnitsByEmployee;
  }

  get uniqueEmployees() {
    const uniqueMap = new Map();
    for (const ctx of this.employees) {
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
