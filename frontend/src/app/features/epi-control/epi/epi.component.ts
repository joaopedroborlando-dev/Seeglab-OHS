import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import IDynamicTableData from '../../../core/models/interfaces/IDynamicTableData';
import { DynamicTableComponent } from '../../../core/components/dynamic-table/dynamic-table.component';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import IEpiDto from '../../../core/http/dtos/IEpiDto';
import { IPaginatedResponse, IPaginationOptions } from '../../../core/http/dtos/PaginationTypes';
import { SideDrawerComponent } from "../../../core/components/side-drawer/side-drawer.component";
import { ModalService } from '../../../core/services/modal.service';
import { isValidDate } from '../../../shared/utils/validationHelpers';

@Component({
  selector: 'app-epi',
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicTableComponent,
    SideDrawerComponent,
    NgxMaskDirective
  ],
  templateUrl: './epi.component.html',
  styleUrl: './epi.component.scss'
})
export class EpiComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  toastService: ToastService = inject(ToastService);
  modalService: ModalService = inject(ModalService);

  dataTable: IDynamicTableData = {
    header: ["NAME", "CA_NUMBER", "CA_EXPIRATION", "MANUFACTURER"],
    data: []
  }

  formGroup = new FormGroup({
    name: new FormControl(''),
    caNumber: new FormControl(''),
    caExpiration: new FormControl(''),
    manufacturer: new FormControl(''),
  });

  editMode = false;
  editItemId!: string;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  drawerOpen = signal(false);

  epiSearchFormGroup = new FormGroup({
    description: new FormControl<string | null>(null),
    expirationStart: new FormControl<string | null>(null),
    expirationEnd: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    await this.fetchEpis();
  }

  async handleCreate(): Promise<void> {
    const name = this.formGroup.get("name")?.value;
    if (!name || name.trim().length === 0) return;

    const payload: IEpiDto = {
      name: name,
      caNumber: this.formGroup.get("caNumber")?.value ?? "",
      caExpiration: (() => {
        const val = this.formGroup.get("caExpiration")?.value as string;
        if (val && val.length === 10) {
          const [day, month, year] = val.split('/');
          return new Date(`${year}-${month}-${day}T00:00:00`);
        }
        return undefined;
      })(),
      manufacturer: this.formGroup.get("manufacturer")?.value ?? "",
    };

    if (!this.editMode) {
      this.apiService.postData("epi/create", payload)
        .then(() => {
          this.toastService.success("EPI_SAVED");
          this.resetForm();
          this.fetchEpis();
        })
        .catch(() => this.toastService.error("FAILED_TO_SAVE"));
    }

    if (this.editMode) {
      this.apiService.postData("epi/update", {
        ...payload,
        id: parseInt(this.editItemId),
      })
        .then(() => {
          this.toastService.success("EPI_SAVED");
          this.resetForm();
          this.editMode = false;
          this.fetchEpis();
        })
        .catch(() => this.toastService.error("FAILED_TO_SAVE"));
    }
  }

  getFilter() {
    const filter: any = {};
    filter.description = this.epiSearchFormGroup.get("description")?.value;
    const expStartStr = this.epiSearchFormGroup.get("expirationStart")?.value;
    if (expStartStr && expStartStr.length === 10) {
      const [d, m, y] = expStartStr.split('/');
      filter.expirationStart = `${y}-${m}-${d}`;
    }
    const expEndStr = this.epiSearchFormGroup.get("expirationEnd")?.value;
    if (expEndStr && expEndStr.length === 10) {
      const [d, m, y] = expEndStr.split('/');
      filter.expirationEnd = `${y}-${m}-${d}`;
    }
    return filter;
  }

  async fetchEpis(page: number = 1): Promise<void> {
    const paginationOptions: IPaginationOptions = {
      limit: this.pageSize,
      page: page,
      filter: this.getFilter()
    };
    this.apiService.postData<IPaginatedResponse<IEpiDto>>("epi/find-all", paginationOptions)
      .then(res => {
        this.dataTable.data = [];
        this.currentPage = res.meta.page;
        this.totalItems = res.meta.total;
        this.totalPages = res.meta.totalPages;
        res.data.forEach(epi => {
          const expDate = epi.caExpiration
            ? new Date(epi.caExpiration).toLocaleDateString("pt-BR")
            : "";
          this.dataTable.data.push({
            rowId: epi.id?.toString() ?? "",
            rowData: [
              { key: "name", value: epi.name ?? "", ref: epi },
              { key: "caNumber", value: epi.caNumber ?? "", ref: null },
              { key: "caExpiration", value: expDate, ref: null },
              { key: "manufacturer", value: epi.manufacturer ?? "", ref: null },
            ]
          });
        });
      })
      .catch(error => console.log(error.message));
  }

  handleEdit(id: string) {
    const row = this.dataTable.data.find(el => el.rowId === id);
    const epiObj: IEpiDto = row?.rowData[0].ref;
    if (!epiObj) return;
    this.formGroup.get("name")?.setValue(epiObj.name ?? "");
    this.formGroup.get("caNumber")?.setValue(epiObj.caNumber ?? "");
    this.formGroup.get("manufacturer")?.setValue(epiObj.manufacturer ?? "");
    if (epiObj.caExpiration) {
      const d = new Date(epiObj.caExpiration);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const formatted = `${day}/${month}/${year}`;
      this.formGroup.get("caExpiration")?.setValue(formatted);
    }
    this.editItemId = id;
    this.editMode = true;
    this.drawerOpen.set(true);
  }

  handleDelete(id: string) {
    this.modalService.open('CONFIRM', 'DELETE_CONFIRM', 'CONFIRM', 'CANCEL').then((result) => {
      if (result) {
        this.apiService.deleteData("epi/delete/" + id, {})
          .then(() => {
            this.toastService.success("EPI_DELETED");
            this.fetchEpis(this.currentPage);
          })
          .catch(() => this.toastService.error("ERROR"));
      }
    });
  }

  handleCancelEdit() {
    this.editMode = false;
    this.resetForm();
    this.drawerOpen.set(false);
  }

  private resetForm() {
    this.formGroup.get("name")?.setValue("");
    this.formGroup.get("caNumber")?.setValue("");
    this.formGroup.get("caExpiration")?.setValue("");
    this.formGroup.get("manufacturer")?.setValue("");
  }

  toggleDrawer() {
    this.drawerOpen.set(!this.drawerOpen());
  }

  handleSearch() {
    const expStartStr = this.epiSearchFormGroup.get("expirationStart")?.value;
    const expEndStr = this.epiSearchFormGroup.get("expirationEnd")?.value;

    let startObj: Date | null = null;
    let endObj: Date | null = null;

    if (expStartStr) {
      if (!isValidDate(expStartStr)) {
        this.toastService.error("INVALID_DATE_FORMAT");
        return;
      }
      const [d, m, y] = expStartStr.split('/');
      startObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    }

    if (expEndStr) {
      if (!isValidDate(expEndStr)) {
        this.toastService.error("INVALID_DATE_FORMAT");
        return;
      }
      const [d, m, y] = expEndStr.split('/');
      endObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    }

    if (startObj && endObj && startObj > endObj) {
      this.toastService.error("START_DATE_GREATER_THAN_END_DATE");
      return;
    }

    this.currentPage = 1;
    this.fetchEpis(this.currentPage);
  }

  handleClear() {
    this.epiSearchFormGroup.reset();
    this.fetchEpis(this.currentPage);
  }
}
