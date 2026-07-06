import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../../core/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IHazardInventory } from '../../../core/models/interfaces/IHazardInventory';
import { CreateHazardInventoryComponent } from './components/create-hazard-inventory/create-hazard-inventory.component';
import { ApiService } from '../../../core/services/api.service';
import { IPaginationOptions } from '../../../core/http/dtos/PaginationTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hazard-inventory',
  imports: [
    CardComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CreateHazardInventoryComponent
  ],
  templateUrl: './hazard-inventory.component.html',
  styleUrl: './hazard-inventory.component.scss'
})
export class HazardInventoryComponent implements OnInit {
  // Service
  apiService: ApiService = inject(ApiService);
  router: Router = inject(Router);
  // Form
  inventoryDescriptionControl = new FormControl("");
  // Inventory
  inventoryData: Array<IHazardInventory> = [];
  // Page Components Control
  createMode: boolean = false;
  hasData: boolean = false;

  async ngOnInit(): Promise<void> {
    await this.fetchInventories()
  }
  handleCardAction = (itemId: string) => {
    this.router.navigate(['pgr/work-unit-inclusion', itemId]);
  }

  onCreateBtnAction = () => {
    this.createMode = !this.createMode;
  }

  onSearchBtnAction = () => {
    if (this.inventoryDescriptionControl.value)
      this.fetchInventories(this.inventoryDescriptionControl.value);
  }

  async fetchInventories(searchTerm?: string) {
    const paginationOptions: IPaginationOptions = {
      limit: 100,
      page: 1,
      search: searchTerm ?? "",
    };
    const response = await this.apiService.postData<{ data: IHazardInventory[] }>("pgr/inventory/find-all", paginationOptions);
    this.inventoryData = response?.data;
    if (this.inventoryData && this.inventoryData.length > 0) this.hasData = true;
  }
}
