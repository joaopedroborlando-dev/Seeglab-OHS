import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../core/components/dynamic-form/dynamic-form.component';
import IDynamicTableData from '../../../core/models/interfaces/IDynamicTableData';
import { DynamicTableComponent } from '../../../core/components/dynamic-table/dynamic-table.component';
import { ApiService } from '../../../core/services/api.service'
import IDepartmentDto from '../../../core/http/dtos/IDepartmentDto';
import { isStringInvalid } from '../../../shared/utils/validationHelpers';
import { IPaginatedResponse, IPaginationOptions } from '../../../core/http/dtos/PaginationTypes';


@Component({
  selector: 'app-department',
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormComponent,
    DynamicTableComponent
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent implements OnInit {
  // Service
  apiService: ApiService = inject(ApiService);
  // Request
  dataTable: IDynamicTableData = {
    header: ["DESCRIPTION"],
    data: []
  }
  // Form
  formGroup = new FormGroup({
    description: new FormControl('')
  });
  editMode = false;
  editItemId!: string;
  // Pagination state
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  protected readonly Math = Math;

  async ngOnInit(): Promise<void> {
    await this.fetchDepartments();
  }

  async handleCreate(): Promise<void> {
    if (isStringInvalid(this.formGroup.get("description")?.value)) {
      return;
    }
    if (!this.editMode)
      this.apiService.postData("business/department/create", { description: this.formGroup.get("description")?.value })
        .then((response: any) => {
          this.formGroup.get("description")?.setValue("");
          this.fetchDepartments();
        });
    if (this.editMode) {
      this.apiService.postData("business/department/update", {
        description: this.formGroup.get("description")?.value,
        id: parseInt(this.editItemId),
      })
        .then((response: any) => {
          this.formGroup.get("description")?.setValue("");
        }).finally(() => {
          this.editMode = false;
          this.fetchDepartments();
        });
    }
  }

  async fetchDepartments(page: number = 1): Promise<void> {
    const paginationOptions: IPaginationOptions = {
      limit: this.pageSize,
      page: page
    };
    this.apiService.postData<IPaginatedResponse<IDepartmentDto>>("business/department/find-all", paginationOptions)
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
    this.fetchDepartments(page);
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
}
