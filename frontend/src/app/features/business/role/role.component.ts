import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../core/components/dynamic-form/dynamic-form.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';
import { DropdownInputComponent, DropdownOption } from '../../../core/components/dropdown-input/dropdown-input.component';
import IDynamicTableData from '../../../core/models/interfaces/IDynamicTableData';
import { isStringInvalid } from '../../../shared/utils/validationHelpers';
import { IPaginatedResponse, IPaginationOptions } from '../../../core/http/dtos/PaginationTypes';
import { DynamicTableComponent } from '../../../core/components/dynamic-table/dynamic-table.component';

import IRoleDto from '../../../core/http/dtos/IRoleDto';
import IDepartmentDto from '../../../core/http/dtos/IDepartmentDto';

@Component({
  selector: 'app-role',
  imports: [
    DynamicFormComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    DynamicTableComponent,
    DropdownInputComponent
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {
  // Service
  apiService: ApiService = inject(ApiService);
  // Request
  dataTable: IDynamicTableData = {
    header: ["DESCRIPTION"],
    data: []
  }
  // Form
  formGroup = new FormGroup({
    description: new FormControl(''),
    department: new FormControl(''),
    name: new FormControl(''),
  });
  departmentData!: IDepartmentDto[];
  departmentOptions: DropdownOption[] = [];
  selectedDepartmentId: number | null = null;
  editMode = false;
  editItemId: string | null = null;
  // Pagination state
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  protected readonly Math = Math;

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.fetchRoles(),
      this.fetchDepartments()
    ]);
  }

  async handleCreate(): Promise<void> {
    if (isStringInvalid(this.formGroup.get("description")?.value)) {
      return;
    }
    if (!this.editMode)
      this.apiService.postData("business/role/create", {
        description: this.formGroup.get("description")?.value,
        name: this.formGroup.get("name")?.value,
        departmentId: this.selectedDepartmentId,
      })
        .then((response: any) => { })
        .finally(() => {
          this.resetForm();
          this.fetchRoles();
        });
    if (this.editMode && this.editItemId) {
      const postObj: IRoleDto = {
        description: this.formGroup.get("description")?.value ?? undefined,
        name: this.formGroup.get("name")?.value ?? undefined,
        id: parseInt(this.editItemId),
      }
      if (this.selectedDepartmentId) postObj.departmentId = this.selectedDepartmentId;
      this.apiService.postData("business/role/update", postObj)
        .then((response: any) => { })
        .finally(() => {
          this.resetForm();
          this.fetchRoles();
        });
    }
  }

  async fetchRoles(page: number = 1): Promise<void> {
    const paginationOptions: IPaginationOptions = {
      limit: this.pageSize,
      page: page
    };
    this.apiService.postData<IPaginatedResponse<IRoleDto>>("business/role/find-all", paginationOptions)
      .then(res => {
        this.dataTable.data = [];
        const data = res;
        this.currentPage = data.meta.page;
        this.totalItems = data.meta.total;
        this.totalPages = data.meta.totalPages;
        data.data.forEach(d => {
          this.dataTable.data.push({
            rowId: d.id?.toString() ?? "",
            rowData: [{ key: d.id?.toString() ?? "", value: d.name ?? "", ref: { name: d.name ?? "", description: d.description ?? "" } }]
          }
          );
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  async fetchDepartments(searchTerm: string = ""): Promise<void> {
    const paginationOptions: IPaginationOptions = {
      limit: 10,
      page: 1,
      search: searchTerm,
    };
    this.apiService.postData<IPaginatedResponse<IDepartmentDto>>("business/department/find-all", paginationOptions)
      .then(res => {
        const responseData = res;
        this.departmentData = responseData.data;
        this.departmentOptions = responseData.data.map(d => ({
          id: d.id!,
          name: d.name ?? d.description ?? ""
        }));
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  // Form Section

  resetForm(): void {
    this.editMode = false;
    this.editItemId = null;
    this.selectedDepartmentId = null;
    this.formGroup.reset();
  }
  /// End Form Section

  // Table handlers Section
  handleEdit(id: string) {
    const row = this.dataTable.data.find(el => el.rowId === id);
    const editDescription = row?.rowData[0].ref?.description;
    const editName = row?.rowData[0].ref?.name;
    this.formGroup.get("description")?.setValue(editDescription ?? "");
    this.formGroup.get("name")?.setValue(editName ?? "");
    this.editItemId = id;
    this.editMode = true;
  }
  // End Table handlers Section

  // Department handlers section
  onDepartmentSelectionChange(option: DropdownOption): void {
    if (option && option.id) {
      this.selectedDepartmentId = option.id as number;
    }
  }
  // End Department handlers section
}
