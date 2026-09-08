import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import IHazardInventoryDto from '../../../core/http/dtos/IHazardInventoryDto';
import IEpiDeliveryDto, { IEpiDeliveryItemDto } from '../../../core/http/dtos/IEpiDeliveryDto';
import { NgxMaskDirective } from 'ngx-mask';
import { SideDrawerComponent } from '../../../core/components/side-drawer/side-drawer.component';
import { SearchableDropdownComponent } from '../../../core/components/searchable-dropdown/searchable-dropdown.component';
import IEpiDto from '../../../core/http/dtos/IEpiDto';

@Component({
  selector: 'app-epi-delivery',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    SideDrawerComponent,
    SearchableDropdownComponent
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
    expiresAt: new FormControl<string | null>(null),
    notes: new FormControl<string>(''),
    deliveredAt: new FormControl<string | null>(null),
    items: new FormArray([])
  });

  drawerOpen = signal(false);
  drawerMode: 'SELECT' | 'CREATE' = 'SELECT';
  availableEpis: any[] = [];
  filteredEpis: any[] = [];
  selectedEpiId = new FormControl<number | null>(null);
  epiSearchControl = new FormControl<string>('');

  newEpiFormGroup = new FormGroup({
    name: new FormControl(''),
    caNumber: new FormControl(''),
    caExpiration: new FormControl(''),
    manufacturer: new FormControl('')
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

    this.setDeliveryDate();
  }

  setDeliveryDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    this.formGroup.get('deliveredAt')?.setValue(`${day}/${month}/${year}`);
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
        expiresAt: new FormControl(this.getExpirationDate())
      }));
    });
  }

  getExpirationDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear() + 1;
    return `${day}/${month}/${year}`;
  }

  async openExtraEpiDrawer() {
    this.drawerMode = 'SELECT';
    this.selectedEpiId.setValue(null);
    this.newEpiFormGroup.reset();

    const excludeIds = this.itemsFormArray.value
      .map((item: any) => item.epiId)
      .filter((id: any) => id != null);

    try {
      const res = await this.apiService.postData<any>("epi/find-all", {
        page: 1,
        limit: 1000,
        filter: { excludeIds }
      });
      this.availableEpis = (res.data || []).map((epi: any) => ({
        ...epi,
        displayName: `${epi.name} ${epi.caNumber ? '- CA ' + epi.caNumber : ''}`
      }));
      this.filteredEpis = [...this.availableEpis];
      this.epiSearchControl.setValue('');
      this.drawerOpen.set(true);
    } catch (error) {
      this.toastService.error("FAILED_TO_LOAD_DATA");
    }
  }

  onEpiSearch(term: string) {
    if (!term) {
      this.filteredEpis = [...this.availableEpis];
      return;
    }
    const lowerTerm = term.toLowerCase();
    this.filteredEpis = this.availableEpis.filter(epi =>
      epi.displayName.toLowerCase().includes(lowerTerm)
    );
  }

  onEpiSelect(epi: any) {
    this.selectedEpiId.setValue(epi.id);
    this.epiSearchControl.setValue(epi.displayName, { emitEvent: false });
  }

  async confirmAddExtraEpi() {
    if (this.drawerMode === 'SELECT') {
      const epiId = this.selectedEpiId.value;
      if (!epiId) return;

      const selectedEpi = this.availableEpis.find(e => e.id === epiId);
      if (selectedEpi) {
        this.itemsFormArray.push(new FormGroup({
          epiId: new FormControl(selectedEpi.id),
          epiName: new FormControl(selectedEpi.name),
          caAtDelivery: new FormControl(selectedEpi.caNumber || ''),
          quantity: new FormControl(1),
          size: new FormControl(''),
          expiresAt: new FormControl(this.getExpirationDate())
        }));
      }
      this.drawerOpen.set(false);
    } else {
      const name = this.newEpiFormGroup.get('name')?.value;
      if (!name || name.trim().length === 0) {
        this.toastService.error("FILL_REQUIRED_FIELDS");
        return;
      }

      const payload: IEpiDto = {
        name: name,
        caNumber: this.newEpiFormGroup.get('caNumber')?.value ?? "",
        caExpiration: (() => {
          const val = this.newEpiFormGroup.get('caExpiration')?.value as string;
          if (val && val.length === 10) {
            const [day, month, year] = val.split('/');
            return new Date(`${year}-${month}-${day}T00:00:00`);
          }
          return undefined;
        })(),
        manufacturer: this.newEpiFormGroup.get('manufacturer')?.value ?? "",
      };

      try {
        const createdEpi = await this.apiService.postData<IEpiDto>("epi/create", payload);
        this.itemsFormArray.push(new FormGroup({
          epiId: new FormControl(createdEpi.id),
          epiName: new FormControl(createdEpi.name),
          caAtDelivery: new FormControl(createdEpi.caNumber || ''),
          quantity: new FormControl(1),
          size: new FormControl(''),
          expiresAt: new FormControl(this.getExpirationDate())
        }));
        this.toastService.success("EPI_SAVED");
        this.drawerOpen.set(false);
      } catch (error) {
        this.toastService.error("FAILED_TO_SAVE");
      }
    }
  }

  removeItem(index: number) {
    this.itemsFormArray.removeAt(index);
  }

  async submitDelivery() {
    const vals = this.formGroup.value;
    if (!vals.employeeId || this.itemsFormArray.length === 0) {
      this.toastService.error("FILL_REQUIRED_FIELDS");
      return;
    }

    const payload: IEpiDeliveryDto = {
      employeeId: vals.employeeId,
      workUnitId: vals.workUnitId ?? undefined,
      deliveredAt: new Date(vals.deliveredAt!),
      notes: vals.notes || undefined,
      items: this.itemsFormArray.value.map((item: any) => {
        return {
          epiId: item.epiId,
          caAtDelivery: item.caAtDelivery,
          quantity: item.quantity,
          size: item.size && item.size.trim().length > 0 ? item.size.toUpperCase() : undefined,
          expiresAt: item.expiresAt
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
