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
    header: ["NAME"],
    data: []
  }
  // Form
  formGroup = new FormGroup({
    description: new FormControl(''),
    name: new FormControl('')
  });
  editMode = false;
  editItemId!: string;
  // Pagination state
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  protected readonly Math = Math;

  async ngOnInit(): Promise<void> {
    await this.fetchDepartments();
  }

  async handleCreate(): Promise<void> {
    if (isStringInvalid(this.formGroup.get("name")?.value)) {
      return;
    }
    if (!this.editMode)
      this.apiService.postData("business/department/create",
        {
          description: this.formGroup.get("description")?.value,
          name: this.formGroup.get("name")?.value
        })
        .then((response: any) => {
          this.formGroup.get("description")?.setValue("");
          this.fetchDepartments();
        });
    if (this.editMode)
      this.apiService.postData("business/department/update", {
        description: this.formGroup.get("description")?.value,
        name: this.formGroup.get("name")?.value,
        id: parseInt(this.editItemId),
      })
        .then((response: any) => {
          this.formGroup.get("description")?.setValue("");
          this.formGroup.get("name")?.setValue("");
        }).finally(() => {
          this.editMode = false;
          this.fetchDepartments();
        });

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
            rowData: [{ key: d.id?.toString() ?? "", value: d.name ?? "", ref: { description: d.description, name: d.name } }]
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
    const departmentObj: any = row?.rowData[0].ref;
    this.formGroup.get("description")?.setValue(departmentObj?.description ?? "");
    this.formGroup.get("name")?.setValue(departmentObj?.name ?? "");
    this.editItemId = id;
    this.editMode = true;
  }
  // End Table handlers Section
}
