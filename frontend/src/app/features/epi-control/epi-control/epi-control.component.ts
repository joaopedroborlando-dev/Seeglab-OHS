import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { NgxMaskDirective } from 'ngx-mask';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SearchableDropdownComponent } from "../../../core/components/searchable-dropdown/searchable-dropdown.component";
import IWorkUnitDto from '../../../core/http/dtos/IWorkUnitDto';
import { IPaginatedResponse, IPaginationOptions } from '../../../core/http/dtos/PaginationTypes';
import { IEpiDeliveryItemDto } from '../../../core/http/dtos/IEpiDeliveryDto';
import { DynamicTableComponent } from '../../../core/components/dynamic-table/dynamic-table.component';
import IDynamicTableData from '../../../core/models/interfaces/IDynamicTableData';

@Component({
  selector: 'app-epi-control',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    TranslateModule,
    SearchableDropdownComponent,
    DynamicTableComponent,
  ],
  templateUrl: './epi-control.component.html',
  styleUrl: './epi-control.component.scss',
})
export class EpiControlComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  toastService: ToastService = inject(ToastService);
  translateService: TranslateService = inject(TranslateService);

  epiDeliverySearchFormGroup = new FormGroup({
    employeeCredencials: new FormControl<string | null>(null),
    workUnitId: new FormControl<number | null>(null),
    expirationDate: new FormControl<string | null>(null),
  });

  // WorkUnit SearchableDropdown
  workUnits: any[] = [];
  workUnitSearchControl = new FormControl<string>('');

  // EPI Deliveries Table
  dataTable: IDynamicTableData = {
    header: ['EPI', 'EMPLOYEE', 'DELIVERY_DATE', 'EXPIRATION_DATE', 'STATUS'],
    data: []
  }
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.onWorkUnitSearch();
    this.fetchDeliveries();
  }

  onWorkUnitSelect(workUnit: IWorkUnitDto | null) {
    this.epiDeliverySearchFormGroup.get('workUnitId')?.setValue(workUnit?.id ?? null);
    this.workUnitSearchControl.setValue(workUnit?.name ?? '');
  }

  async onWorkUnitSearch(searchTerm: string = '') {
    try {
      const res = await this.apiService.postData<IPaginatedResponse<IWorkUnitDto>>("pgr/work-unit/find-by-name-like", {
        page: 1,
        limit: 1000,
        search: searchTerm
      });
      this.workUnits = (res.data || []).map((workUnit: IWorkUnitDto) => ({
        ...workUnit,
        displayName: workUnit.name
      }));
    } catch (error) {
      this.toastService.error("FAILED_TO_LOAD_DATA");
    }
  }

  handleSearch() {
    this.fetchDeliveries();
  }

  handleClear() {
    this.epiDeliverySearchFormGroup.reset();
    this.workUnitSearchControl.setValue('');
    this.fetchDeliveries();
  }

  getFilter(): any {
    return {
      employeeCredencials: this.epiDeliverySearchFormGroup.get('employeeCredencials')?.value,
      workUnitId: this.epiDeliverySearchFormGroup.get('workUnitId')?.value,
      expirationDate: this.epiDeliverySearchFormGroup.get('expirationDate')?.value
    }
  }

  async fetchDeliveries(page: number = 1) {
    const paginationOptions: IPaginationOptions = {
      limit: this.pageSize,
      page: page,
      filter: this.getFilter()
    };
    const toDDMMyyyy = (date: Date) => {
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    }
    try {
      const res = await this.apiService.postData<IPaginatedResponse<IEpiDeliveryItemDto>>("epi/delivery/find-all-deliveries", paginationOptions);
      const data = res.data || [];
      this.currentPage = res.meta.page;
      this.totalItems = res.meta.total;
      this.totalPages = res.meta.totalPages;
      this.dataTable.data = data.map(el => {
        return {
          rowId: el.id?.toString() ?? "",
          rowData: [
            { key: "epi", value: el.epiName ?? "", ref: null },
            { key: "employee", value: el.employeeCredencials ?? "", ref: null },
            { key: "delivery_date", value: el.deliveryDate ? toDDMMyyyy(el.deliveryDate) : "", ref: null },
            { key: "expires_at", value: el.expiresAt ? toDDMMyyyy(new Date(el.expiresAt)) : "", ref: null },
            { key: "status", value: el.status ? this.translateService.instant(el.status) : "", ref: null }
          ]
        }
      })
    } catch (error: any) {
      console.error("Error fetching deliveries:", error.message);
      this.toastService.error(error.message);
    }
  }
}
