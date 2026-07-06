import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HazardAssessmentsService } from '../../../services/hazard-assessments.service';
import { Subscription } from 'rxjs';
import IHazardAssessmentDto from '../../../../../core/http/dtos/IHazardAssessmentDto';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DropdownInputComponent,
  DropdownOption
} from '../../../../../core/components/dropdown-input/dropdown-input.component';
import { ApiService } from '../../../../../core/services/api.service';
import IFactorDto from '../../../../../core/http/dtos/IFactorDto';
import { FormRowFactorMapper } from '../../../../../core/http/mappers/FormRowFactorMapper';
import { IPaginatedResponse } from '../../../../../core/http/dtos/PaginationTypes';
import IRowFactorDto from '../../../../../core/http/dtos/IRowFactorDto';
import { ToastService } from '../../../../../core/services/toast.service';
import { WorkUnitService } from '../../../services/work-unit.service';
import IHazardDto from '../../../../../core/http/dtos/IHazardDto';
import { HazardAssessmentTableComponent } from "../hazard-assessment-table/hazard-assessment-table.component";
import { IControlMeasureDto } from '../../../../../core/http/dtos/IControlMeasureDto';

@Component({
  selector: 'app-hazard-card',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    NgClass,
    DropdownInputComponent,
    HazardAssessmentTableComponent
  ],
  templateUrl: './hazard-card.component.html',
  styleUrl: './hazard-card.component.scss'
})
export class HazardCardComponent implements OnInit, OnDestroy {
  // Services
  apiService: ApiService = inject(ApiService);
  assessmentService: HazardAssessmentsService = inject(HazardAssessmentsService);
  toastService: ToastService = inject(ToastService);
  workUnitService: WorkUnitService = inject(WorkUnitService);

  // Hazard Assessment Control
  assessmentSub!: Subscription;
  currentAssessment: IHazardAssessmentDto | null = null;

  // Work Unit Control
  workUnitSub!: Subscription;

  // Risk Factors Dropdown State
  factorOptions: DropdownOption[] = [];
  isLoadingFactors = false;

  // Included Risk Factors Dropdown State
  @ViewChild('dropdownContainer', { static: false }) dropdownContainer!: ElementRef;
  includedFactorsOptions: DropdownOption[] = [];
  showIncludedFactorsDropdown: boolean = false;
  selectedIncludedFactorsIndex: number = -1;

  // Row Factor FormGroup
  rowFactorGroup = new FormGroup({
    factor: new FormControl(null, [Validators.required]),
    intensity: new FormControl(null, [Validators.required]),
    technique: new FormControl(null, [Validators.required]),
    source: new FormControl(null, [Validators.required]),
    exposureTime: new FormControl(null, [Validators.required]),
    harm: new FormControl(null, [Validators.required]),
    probability: new FormControl(null, [Validators.required]),
    severity: new FormControl(null, [Validators.required]),
  })

  matrixArr: string[] = [
    'VERY_LOW',
    'LOW',
    'MODERATE',
    'HIGH',
    'VERY_HIGH',
  ]

  exposureTimeArr: string[] = [
    'INTERMITTENT',
    'OCCASIONAL',
    'PERMANENT',
  ]

  constructor() { }

  ngOnDestroy(): void {
    this.assessmentSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.assessmentSub = this.assessmentService.assessments$.subscribe(assessment => {
      if (assessment) {
        this.currentAssessment = assessment;
        // Load initial factors when assessment is set
        this.onFactorSearch('');
      } else {
        this.currentAssessment = null
      }
    });

    this.workUnitSub = this.workUnitService.workUnit$.subscribe(workUnit => {
      if (workUnit) {
        this.includedFactorsOptions = workUnit.hazardAssessments?.map(assessment => ({
          id: assessment.hazard.id ?? -1,
          name: assessment.hazard.description,
          data: assessment.hazard
        })) || [];
      }
    })
  }

  //#region Persist Region
  createRowFactor(row: IRowFactorDto): void {
    this.apiService.postData<IRowFactorDto>("pgr/row/create", row).then((res) => {
      this.updateHazardAssessmentState(res);
    }).catch((err) => {
      console.error('Error creating row factor:', err);
    });
  }

  updateHazardAssessmentState(row: IRowFactorDto | null): void {
    if (row) {
      const newRowFactorArr = this.currentAssessment?.rows?.filter(r => r.id !== row.id) || [];
      newRowFactorArr.unshift(row);
      this.assessmentService.updateHazardAssessmentsState({ rows: newRowFactorArr });
      this.toastService.success('ROW_FACTOR_SUCCESS');
    }
    this.rowFactorGroup.reset();
  }

  onSubmit(): void {
    this.rowFactorGroup.markAllAsTouched();
    if (this.rowFactorGroup.invalid) return;
    const rowFactorDto = FormRowFactorMapper.mapRowFactorFormToDto(
      this.rowFactorGroup.value,
      this.currentAssessment?.id,
      this.currentAssessment?.hazard?.id ?? undefined
    )
    this.createRowFactor(rowFactorDto);
  }

  onInsertRow(row: Partial<IRowFactorDto>): void {
    const rowFactorDto = FormRowFactorMapper.mapRowFactorToDto(
      row as IRowFactorDto,
      this.currentAssessment?.id,
      this.currentAssessment?.hazard?.id ?? undefined
    );
    this.createRowFactor(rowFactorDto);
  }
  //#endregion

  //#region Risk Factor Input Region
  async onFactorSearch(searchTerm: string): Promise<void> {
    if (!this.currentAssessment || !this.currentAssessment.hazard) {
      this.factorOptions = [];
      return;
    }

    this.isLoadingFactors = true;

    try {
      const factors = await this.fetchRiskFactorsByHazard(searchTerm);
      this.factorOptions = factors.map(factor => ({
        id: factor.id ?? -1,
        name: factor.description,
        originalData: factor
      }));
    } catch (error) {
      console.error('Error searching factors:', error);
      this.factorOptions = [];
    } finally {
      this.isLoadingFactors = false;
    }
  }

  onFactorSelected(option: DropdownOption): void { }

  private async fetchRiskFactorsByHazard(searchTerm: string): Promise<IFactorDto[]> {
    if (!this.currentAssessment || !this.currentAssessment.hazard) {
      return [];
    }

    const paginationOptions = {
      limit: 100,
      page: 1,
      search: searchTerm ?? "",
      hazardId: this.currentAssessment.hazard.id
    };

    try {
      const res = await this.apiService.getData<IPaginatedResponse<IFactorDto>>("pgr/factor/find-all-by-hazard", paginationOptions);
      const responseData = res;
      return responseData.data;
    } catch (error) {
      console.error('Error fetching risk factors:', error);
      return [];
    }
  }
  //#endregion

  //#region Risk Factor Selection Region
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Only check the dropdown container, not the entire component
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  // Listen for escape key to close dropdown
  @HostListener('document:keydown.escape', ['$event.target'])
  onEscapeKey(event: EventTarget | null): void {
    this.closeDropdown();
  }
  private closeDropdown(): void {
    if (this.showIncludedFactorsDropdown) {
      this.showIncludedFactorsDropdown = false;
      this.selectedIncludedFactorsIndex = -1;
    }
  }

  searchHazardAssessmentsAndSetState(hazard: IHazardDto) {
    const workUnit = this.workUnitService.getWorkUnitState();
    if (!workUnit) return;
    const hazardAssessment = workUnit.hazardAssessments?.find(el => el.hazard.id == hazard.id);
    if (!hazardAssessment) return;
    this.assessmentService.setHazardAssessmentState(hazardAssessment);
  }

  selectIncludedFactorsOption(option: DropdownOption, index: number): void {
    this.closeDropdown();
    this.searchHazardAssessmentsAndSetState(option["data"]);
  }

  onRiskFactorsBtnClicked(): void {
    this.showIncludedFactorsDropdown = !this.showIncludedFactorsDropdown;
  }
  //#endregion

  //#region Control Measure Region

  onInsertControlMesure(controlMesure: IControlMeasureDto): void {
    console.log(controlMesure);
    this.apiService.postData<IControlMeasureDto>("pgr/control-measure/create", controlMesure).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error('Error creating control measure:', err);
    });
  }

  deleteControlMesure(controlMesureId: number) {
    this.apiService.deleteData("pgr/control-measure/delete", { id: controlMesureId }).then((res: boolean) => {
      if (res) {
        this.toastService.success('CONTROL_MEASURE_DELETED');
      }
    }).catch((err) => {
      console.error('Error deleting control measure:', err);
    });
  }
  //#endregion
}
