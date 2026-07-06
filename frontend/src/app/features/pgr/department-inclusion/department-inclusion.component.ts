import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import IHazardInventoryDto from '../../../core/http/dtos/IHazardInventoryDto';
import { DepartmentBindingGridComponent } from './components/department-binding-grid/department-binding-grid.component';
import { HazardInventoryService } from '../services/hazard-inventory.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { CardComponent } from '../../../core/components/card/card.component';
import IWorkUnitDto from '../../../core/http/dtos/IWorkUnitDto';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-department-inclusion',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DepartmentBindingGridComponent,
    TranslatePipe,
    CardComponent
  ],
  templateUrl: './department-inclusion.component.html',
  styleUrl: './department-inclusion.component.scss'
})
export class DepartmentInclusionComponent implements OnInit, OnDestroy {
  // Services
  private activatedRouter: ActivatedRoute = inject(ActivatedRoute);
  private apiService: ApiService = inject(ApiService);
  private depAssessmentService: HazardInventoryService = inject(HazardInventoryService);
  private toastService: ToastService = inject(ToastService);
  private router = inject(Router);

  // Control
  inventoryId!: number;
  inventory?: IHazardInventoryDto;
  _inventorySubscription!: Subscription;
  //

  // Load section
  async ngOnInit(): Promise<void> {
    this.activatedRouter.params.subscribe((params: Params) => {
      this.inventoryId = params['inventoryId']
      this.fetchInventory()
    })
    this._inventorySubscription = this.depAssessmentService.hazardInventory$.subscribe((value) => {
      if (value)
        this.inventory = value;
    })
  }

  ngOnDestroy(): void {
    this._inventorySubscription.unsubscribe();
  }

  async fetchInventory() {
    const response = await this.apiService.postData<IHazardInventoryDto>("pgr/inventory/find-one", { inventoryId: this.inventoryId });
    this.inventory = response;
    if (this.inventory) {
      // set hazard inventory state
      this.depAssessmentService.setHazardInventoryState({
        id: this.inventory?.id ?? undefined,
        businessId: this.inventory.businessId,
        description: this.inventory?.description,
        createdAt: this.inventory?.createdAt,
        workUnits: this.inventory.workUnits ?? [],
      })
    }
  }
  // End load section

  // Card handlers section
  async onDeleteAction(event: string): Promise<void> {
    try {
      await this.apiService.deleteData("pgr/dep-assessment/delete", { id: parseInt(event) });
      if (this.inventory?.workUnits) {
        const filteredDeptAssessmentArray = this.inventory.workUnits.filter(el => el.id?.toString() != event);
        this.depAssessmentService.updateHazardInventoryState({ workUnits: filteredDeptAssessmentArray });
      }
      this.toastService.success('SUCCESSFULLY_DELETED');
    } catch (error) {
      this.toastService.error('ERROR');
    }
  }

  onCardAction(event: string): void {
    this.router.navigate(['/pgr/assessment'], { queryParams: { assessmentId: event } });
  }

  getCardText(workUnitsDto: IWorkUnitDto): string {
    let text: string = "";
    if (!workUnitsDto.roles) return text;

    for (let role of workUnitsDto.roles) {
      if (text.length > 0)
        text = text + " | " + role.description;
      else text = text + role.description;
    }

    return text;
  }
  // End card handlers section
}
