import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import IDynamicTableData from '../../../core/models/interfaces/IDynamicTableData';
import { DynamicTableComponent } from '../../../core/components/dynamic-table/dynamic-table.component';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import IEmployeeDto, { maritalStatus } from '../../../core/http/dtos/IEmployeeDto';
import IRoleDto from '../../../core/http/dtos/IRoleDto';
import { IPaginatedResponse, IPaginationOptions } from '../../../core/http/dtos/PaginationTypes';
import { SideDrawerComponent } from "../../../core/components/side-drawer/side-drawer.component";
import { ModalService } from '../../../core/services/modal.service';
import { isValidDate } from '../../../shared/utils/validationHelpers';
import { BoxListComponent } from '../../../core/components/box-list/box-list.component';
import { SearchableDropdownComponent } from '../../../core/components/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicTableComponent,
    SideDrawerComponent,
    NgxMaskDirective,
    BoxListComponent,
    SearchableDropdownComponent
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  toastService: ToastService = inject(ToastService);
  modalService: ModalService = inject(ModalService);

  dataTable: IDynamicTableData = {
    header: ["NAME", "CPF", "POST", "ROLES"],
    data: []
  }

  formGroup = new FormGroup({
    name: new FormControl(''),
    birthDate: new FormControl(''),
    maritalStatus: new FormControl(''),
    CPF: new FormControl(''),
    PIS: new FormControl(''),
    post: new FormControl(''),
    roleIds: new FormControl<number[]>([]),
  });

  editMode = false;
  editItemId!: string;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  drawerOpen = signal(false);

  maritalStatuses = Object.values(maritalStatus);

  employeeSearchFormGroup = new FormGroup({
    description: new FormControl<string | null>(null),
  });

  availableRoles: IRoleDto[] = [];
  filteredRoles: IRoleDto[] = [];
  selectedRoles: IRoleDto[] = [];
  roleControl = new FormControl('');

  async ngOnInit(): Promise<void> {
    await this.fetchRoles();
    await this.fetchEmployees();
  }

  async fetchRoles(): Promise<void> {
    const paginationOptions: IPaginationOptions = { limit: 1000, page: 1 };
    try {
      const res = await this.apiService.postData<IPaginatedResponse<IRoleDto>>("business/role/find-all", paginationOptions);
      this.availableRoles = res.data;
      this.filteredRoles = res.data;
    } catch (e) {
      console.error(e);
    }
  }

  async handleCreate(): Promise<void> {
    const name = this.formGroup.get("name")?.value;
    if (!name || name.trim().length === 0) return;

    const payload: IEmployeeDto = {
      name: name,
      CPF: this.formGroup.get("CPF")?.value ?? "",
      PIS: this.formGroup.get("PIS")?.value ?? "",
      maritalStatus: this.formGroup.get("maritalStatus")?.value ?? "",
      post: this.formGroup.get("post")?.value ?? "",
      roleIds: this.selectedRoles.map(r => r.id as number),
      birthDate: (() => {
        const val = this.formGroup.get("birthDate")?.value as string;
        if (val && val.length === 10) {
          const [day, month, year] = val.split('/');
          return new Date(`${year}-${month}-${day}T00:00:00`);
        }
        return undefined;
      })(),
    };

    if (!this.editMode) {
      this.apiService.postData("business/employee/create", payload)
        .then(() => {
          this.toastService.success("EMPLOYEE_SAVED");
          this.resetForm();
          this.fetchEmployees();
        })
        .catch(() => this.toastService.error("FAILED_TO_SAVE"));
    }

    if (this.editMode) {
      this.apiService.postData("business/employee/update", {
        ...payload,
        id: parseInt(this.editItemId),
      })
        .then(() => {
          this.toastService.success("EMPLOYEE_SAVED");
          this.resetForm();
          this.editMode = false;
          this.fetchEmployees();
        })
        .catch(() => this.toastService.error("FAILED_TO_SAVE"));
    }
  }

  getFilter() {
    const filter: any = {};
    filter.description = this.employeeSearchFormGroup.get("description")?.value;
    return filter;
  }

  async fetchEmployees(page: number = 1): Promise<void> {
    const paginationOptions: IPaginationOptions = {
      limit: this.pageSize,
      page: page,
      filter: this.getFilter()
    };
    this.apiService.postData<IPaginatedResponse<IEmployeeDto>>("business/employee/find-all", paginationOptions)
      .then(res => {
        this.dataTable.data = [];
        this.currentPage = res.meta.page;
        this.totalItems = res.meta.total;
        this.totalPages = res.meta.totalPages;
        res.data.forEach(employee => {
          const rolesNames = employee.roles?.map(r => r.name).join(", ") || "";

          this.dataTable.data.push({
            rowId: employee.id?.toString() ?? "",
            rowData: [
              { key: "name", value: employee.name ?? "", ref: employee },
              { key: "CPF", value: employee.CPF ?? "", ref: null },
              { key: "post", value: employee.post ?? "", ref: null },
              { key: "roles", value: rolesNames, ref: null },
            ]
          });
        });
      })
      .catch(error => console.log(error.message));
  }

  handleEdit(id: string) {
    const row = this.dataTable.data.find(el => el.rowId === id);
    const employeeObj: IEmployeeDto = row?.rowData[0].ref;
    if (!employeeObj) return;

    this.formGroup.get("name")?.setValue(employeeObj.name ?? "");
    this.formGroup.get("CPF")?.setValue(employeeObj.CPF ?? "");
    this.formGroup.get("PIS")?.setValue(employeeObj.PIS ?? "");
    this.formGroup.get("maritalStatus")?.setValue(employeeObj.maritalStatus ?? "");
    this.formGroup.get("post")?.setValue(employeeObj.post ?? "");

    const roleIds = employeeObj.roles?.map(r => r.id as number) ?? [];
    this.formGroup.get("roleIds")?.setValue(roleIds);
    this.selectedRoles = [...(employeeObj.roles ?? [])];
    this.roleControl.setValue('');

    if (employeeObj.birthDate) {
      const d = new Date(employeeObj.birthDate);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const formatted = `${day}/${month}/${year}`;
      this.formGroup.get("birthDate")?.setValue(formatted);
    }
    this.editItemId = id;
    this.editMode = true;
    this.drawerOpen.set(true);
  }

  handleDelete(id: string) {
    this.modalService.open('CONFIRM', 'DELETE_CONFIRM', 'CONFIRM', 'CANCEL').then((result) => {
      if (result) {
        this.apiService.deleteData("business/employee/delete/" + id, {})
          .then(() => {
            this.toastService.success("EMPLOYEE_DELETED");
            this.fetchEmployees(this.currentPage);
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
    this.formGroup.get("birthDate")?.setValue("");
    this.formGroup.get("maritalStatus")?.setValue("");
    this.formGroup.get("CPF")?.setValue("");
    this.formGroup.get("PIS")?.setValue("");
    this.formGroup.get("post")?.setValue("");
    this.formGroup.get("roleIds")?.setValue([]);
    this.selectedRoles = [];
    this.roleControl.setValue('');
  }

  toggleDrawer() {
    this.drawerOpen.set(!this.drawerOpen());
  }

  handleSearch() {
    this.currentPage = 1;
    this.fetchEmployees(this.currentPage);
  }

  handleClear() {
    this.employeeSearchFormGroup.reset();
    this.fetchEmployees(this.currentPage);
  }

  onRoleSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredRoles = this.availableRoles;
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      this.filteredRoles = this.availableRoles.filter(r => r.name?.toLowerCase().includes(lowerTerm));
    }
  }

  onRoleSelected(role: IRoleDto): void {
    if (role && role.name) {
      this.roleControl.setValue(role.name);
    }
  }

  addRoleToList(): void {
    const roleStr = this.roleControl.value;
    const role = this.availableRoles.find(el => el.name === roleStr);
    if (role) {
      if (this.selectedRoles.some(el => el.id === role.id)) {
        this.toastService.warning('ALREADY_BOUND');
        this.roleControl.setValue('');
        return;
      }
      this.selectedRoles.push(role);
      this.roleControl.setValue('');
    }
  }

  deleteRoleToList($event: any): void {
    const role = this.selectedRoles.find(r => r.id === $event?.id);
    if (role) {
      this.selectedRoles = this.selectedRoles.filter(el => el.id !== role.id);
    }
  }
}
