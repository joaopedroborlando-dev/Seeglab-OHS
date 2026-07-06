import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../core/components/dynamic-form/dynamic-form.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';
import IDynamicTableData from '../../../core/models/interfaces/IDynamicTableData';
import { isStringInvalid } from '../../../shared/utils/validationHelpers';
import { IPaginatedResponse, IPaginationOptions } from '../../../core/http/dtos/PaginationTypes';
import { DynamicTableComponent } from '../../../core/components/dynamic-table/dynamic-table.component';

import IRoleDto from '../../../core/http/dtos/IRoleDto';
import IDepartmentDto from '../../../core/http/dtos/IDepartmentDto';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-role',
  imports: [
    DynamicFormComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    DynamicTableComponent
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
  });
  departmentData!: IDepartmentDto[];
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
    this.setupDepartmentSearchListener();

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
            rowData: [{ key: d.id?.toString() ?? "", value: d.description ?? "" }]
          }
          );
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  async fetchDepartments(): Promise<void> {
    const searchTerm = this.formGroup.get("department")?.value || ""
    const paginationOptions: IPaginationOptions = {
      limit: 10,
      page: 1,
      search: searchTerm,
    };
    this.apiService.postData<IPaginatedResponse<IDepartmentDto>>("business/department/find-all", paginationOptions)
      .then(res => {
        const responseData = res;
        this.departmentData = responseData.data;
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  // Form Section

  setupDepartmentSearchListener(): void {
    this.formGroup.get("department")?.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.fetchDepartments();
      });
  }

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
    const editDescription = row?.rowData[0].value;
    this.formGroup.get("description")?.setValue(editDescription ?? "");
    this.editItemId = id;
    this.editMode = true;
  }
  // End Table handlers Section


  // Pagination Section
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.fetchRoles(page);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }
  // End Pagination Section

  // Department handlers section
  onDepartmentSelectionChange(): void {
    const department = this.departmentData.find(
      dept => dept.description === this.formGroup.get("department")?.value
    );
    if (department && department.id) {
      this.selectedDepartmentId = department.id;
    }
  }
  // End Department handlers section
}
