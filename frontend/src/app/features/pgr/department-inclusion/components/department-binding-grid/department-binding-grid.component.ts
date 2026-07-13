import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IDepartmentAssessment } from '../../../../../core/models/interfaces/IDepartmentAssessment';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IPaginatedResponse, IPaginationOptions } from '../../../../../core/http/dtos/PaginationTypes';
import IDepartmentDto from '../../../../../core/http/dtos/IDepartmentDto';
import { ApiService } from '../../../../../core/services/api.service';
import IRoleDto from '../../../../../core/http/dtos/IRoleDto';
import IDepartment from '../../../../../core/models/interfaces/IDepartment';
import IHazardInventoryDto from '../../../../../core/http/dtos/IHazardInventoryDto';
import { BoxListComponent } from '../../../../../core/components/box-list/box-list.component';
import { SearchableDropdownComponent } from '../../../../../core/components/searchable-dropdown/searchable-dropdown.component';
import { TranslatePipe } from '@ngx-translate/core';
import { HazardInventoryService } from '../../../services/hazard-inventory.service';
import IWorkUnitDto from '../../../../../core/http/dtos/IWorkUnitDto';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-department-binding-grid',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BoxListComponent,
    SearchableDropdownComponent,
    TranslatePipe
  ],
  templateUrl: './department-binding-grid.component.html',
  styleUrl: './department-binding-grid.component.scss'
})
export class DepartmentBindingGridComponent implements OnInit, OnDestroy {
  // Services
  deptAssessmentSubscription!: Subscription;
  apiService: ApiService = inject(ApiService);
  depAssessmentService: HazardInventoryService = inject(HazardInventoryService);
  toastService: ToastService = inject(ToastService);

  // Data Control
  departmentAssessment: IDepartmentAssessment | null = null;
  inventoryId!: number;
  inventory?: IHazardInventoryDto;
  departmentControl = new FormControl('');
  roleControl = new FormControl({ value: '', disabled: true });
  nameControl = new FormControl('', { nonNullable: true });
  roleData: IRoleDto[] = [];
  departmentData: IDepartmentDto[] = [];
  selectedDepartment: IDepartment | null = null;
  selectedRole: IRoleDto | null = null;
  bindDepartmentSelected: boolean = false;
  rolesToBind: IRoleDto[] = [];

  //Input variables
  iconName = 'bi bi-link';

  ngOnInit(): void {
    this.fetchDepartments();
  }

  ngOnDestroy(): void {
    if (this.deptAssessmentSubscription)
      this.deptAssessmentSubscription.unsubscribe();
  }

  //#region-----------------Load section---------------------------------
  async fetchDepartments(searchTerm: string = ''): Promise<void> {
    const paginationOptions: IPaginationOptions = {
      limit: 10,
      page: 1,
      search: searchTerm,
    };

    try {
      const res = await this.apiService.postData<IPaginatedResponse<IDepartmentDto>>("business/department/find-all", paginationOptions);
      const responseData = res;
      this.departmentData = responseData.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async fetchInventory() {
    const response = await this.apiService.postData<IHazardInventoryDto>("pgr/inventory/find-one", { inventoryId: this.inventoryId });
    this.inventory = response;
  }

  async fetchRolesByDepartment(searchTerm: string = ''): Promise<void> {
    if (!this.selectedDepartment?.id) return;
    const paginationOptions = {
      limit: 10,
      page: 1,
      search: searchTerm,
      departmentId: this.selectedDepartment.id
    };

    try {
      const res = await this.apiService.postData<IPaginatedResponse<IRoleDto>>("business/role/find-all-by-department", paginationOptions);
      const responseData = res;
      this.roleData = [];
      this.roleData = responseData.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }
  //--------------------End load section-------------------------

  //#region -----------------Department handlers section------------------
  onDepartmentSelected(department: IDepartmentDto): void {
    if (department && department.id && department.name) {
      this.selectedDepartment = {
        id: department.id,
        name: department.name,
        description: department.description ?? "",
        roles: []
      };
      this.departmentControl.setValue(department.name);
      // Reset role selection
      this.roleControl.setValue('');
      this.roleData = [];
      this.selectedRole = null;
      this.fetchRolesByDepartment();
    }
  }

  onDepartmentSearch(searchTerm: string): void {
    if (this.selectedDepartment) return;
    console.log("Chamouuuu")
    this.fetchDepartments(searchTerm);
  }

  cleanDepartment(): void {
    this.bindDepartmentSelected = false;
    this.departmentControl.setValue('');
    this.roleControl.setValue('');
    this.departmentControl.enable();
    this.roleControl.disable();
    this.selectedDepartment = null;
    this.selectedRole = null;
    this.roleData = [];
    this.iconName = 'bi bi-link';
    this.fetchDepartments();
  }

  cleanRole(): void {
    this.rolesToBind = [];
  }

  onDepartmentBindClick(): void {
    if (this.selectedDepartment?.id && this.bindDepartmentSelected && this.rolesToBind.length == 0) {
      this.cleanDepartment();
      return;
    }

    if (this.selectedDepartment?.id) {
      this.bindDepartmentSelected = !this.bindDepartmentSelected;
      this.iconName = 'bi bi-unlock-fill';
      this.departmentControl.disable();
      this.roleControl.enable();
    }
  }

  //----------------End Department handlers section---------------------

  //#region -------------------Role handlers section----------------------------
  onRoleSelected(role: IRoleDto): void {
    if (role && role.id && role.name) {
      this.selectedRole = role;
      this.roleControl.setValue(role.name);
    }
  }

  onRoleSearch(searchTerm: string): void {
    this.fetchRolesByDepartment(searchTerm);
  }

  addRoleToList(): void {
    const roleStr = this.roleControl.value;
    const role = this.roleData?.find(el => el.name === roleStr);
    if (role) {
      if (this.rolesToBind.some(el => el.id === role.id)) {
        this.toastService.warning('ALREADY_BOUND');
        this.roleControl.reset();
        return;
      }
      this.rolesToBind.push(role);
      this.roleControl.reset();
    }
  }

  deleteRoleToList($event: any): void {
    const role = this.rolesToBind.find(role => role.id === $event?.id);
    if (role) {
      this.rolesToBind = this.rolesToBind.filter(el => el.id !== role.id);
    }
  }
  //--------------------End Role handlers section------------------------

  //#region----------------------------Submit section---------------------------
  onSuccess(): void {
    this.cleanDepartment();
    this.cleanRole();
  }

  async onSubmit(): Promise<void> {
    const inventory = this.depAssessmentService.getHazardInventoryState();
    console.log(inventory, this.selectedDepartment, this.rolesToBind.length);
    if (
      !this.selectedDepartment
      || !inventory
      || this.rolesToBind.length === 0
    ) {
      this.toastService.warning('INCOMPLETE_DATA');
      return;
    }
    const newDeptAssessment: IWorkUnitDto = {
      departmentId: this.selectedDepartment.id,
      inventoryId: inventory.id,
      name: this.nameControl.value,
      roles: this.rolesToBind
    }
    try {
      const res = await this.apiService.postData<IWorkUnitDto>("pgr/work-unit/create", newDeptAssessment);
      const savedWorkUnitsDto: IWorkUnitDto = res;
      inventory.workUnits?.push(savedWorkUnitsDto);
      this.depAssessmentService.updateHazardInventoryState({ workUnits: inventory.workUnits });
      this.onSuccess();
    } catch (error: any) {
      this.toastService.error(error.error);
    }
  }
  //----------------------End submit section ----------------------------
}
