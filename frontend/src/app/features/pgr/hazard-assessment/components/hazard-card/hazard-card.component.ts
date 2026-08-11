import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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
import { IPaginatedResponse, IPaginationOptions } from '../../../../../core/http/dtos/PaginationTypes';
import IRowFactorDto from '../../../../../core/http/dtos/IRowFactorDto';
import { ToastService } from '../../../../../core/services/toast.service';
import { WorkUnitService } from '../../../services/work-unit.service';
import IHazardDto from '../../../../../core/http/dtos/IHazardDto';
import { HazardAssessmentTableComponent } from "./components/hazard-assessment-table/hazard-assessment-table.component";
import { IControlMeasureDto } from '../../../../../core/http/dtos/IControlMeasureDto';
import { ModalService } from '../../../../../core/services/modal.service';
import { SideDrawerComponent } from "../../../../../core/components/side-drawer/side-drawer.component";
import IEpiDto from '../../../../../core/http/dtos/IEpiDto';
import { IControlMeasureInsertDto } from '../../../../../core/http/dtos/IControlMeasureInsertDto';

@Component({
  selector: 'app-hazard-card',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    HazardAssessmentTableComponent,
    NgClass,
    DropdownInputComponent,
    SideDrawerComponent
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
  modalService: ModalService = inject(ModalService);

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
    id: new FormControl<number | null>(null),
    factorDescription: new FormControl('', [Validators.required]),
    factorId: new FormControl<number | null>(null),
    intensity: new FormControl<string | null>(''),
    technique: new FormControl<string | null>(''),
    source: new FormControl<string | null>('', [Validators.required]),
    exposureTime: new FormControl<string | null>('INTERMITTENT', [Validators.required]),
    harm: new FormControl<string | null>('', [Validators.required]),
    probability: new FormControl<string | null>('VERY_LOW', [Validators.required]),
    severity: new FormControl<string | null>('VERY_LOW', [Validators.required]),
  })

  // Collape DIV
  @ViewChild('collapseForm', { static: false }) collapseFormRef!: ElementRef;

  // Control Measure
  drawerOpen = signal(false);
  controlMeasureForm = new FormGroup({
    id: new FormControl<number | null>(null),
    administrativeMeasure: new FormControl<string | null>(null),
    epc: new FormControl<string | null>(null),
  });
  rowFactorId: number | null = null;

  // Epi
  epiOptions: DropdownOption[] = [];
  selectedEpis: DropdownOption[] = [];

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

  openForm() {
    if (this.collapseFormRef) {
      const bsCollapse = (window as any).bootstrap?.Collapse?.getInstance(this.collapseFormRef.nativeElement);
      if (bsCollapse) {
        bsCollapse.show();
      } else {
        new (window as any).bootstrap.Collapse(this.collapseFormRef.nativeElement, { toggle: false }).show();
      }
    }
  }

  collapseForm() {
    if (this.collapseFormRef) {
      const bsCollapse = (window as any).bootstrap?.Collapse?.getInstance(this.collapseFormRef.nativeElement);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        new (window as any).bootstrap.Collapse(this.collapseFormRef.nativeElement, { toggle: false }).hide();
      }
    }
  }

  onCancelSubmit() {
    this.rowFactorGroup.markAsUntouched();
    this.rowFactorGroup.reset();
    this.collapseForm();
  }

  onEditRowFactor(rowFactorDto: IRowFactorDto): void {
    this.rowFactorGroup.patchValue({
      id: rowFactorDto.id,
      factorDescription: rowFactorDto?.factor?.description ?? '',
      factorId: rowFactorDto?.factor?.id,
      intensity: rowFactorDto?.intensity,
      technique: rowFactorDto?.technique,
      source: rowFactorDto.source,
      exposureTime: FormRowFactorMapper.exposureTimeEnumToString(rowFactorDto.exposureTime),
      harm: rowFactorDto.harm,
      probability: FormRowFactorMapper.matrixEnumToString(rowFactorDto.probability),
      severity: FormRowFactorMapper.matrixEnumToString(rowFactorDto.severity),
    })
    this.openForm();
  }

  async onDeleteRow(id: number) {
    this.modalService.open('CONFIRM', 'DELETE_CONFIRM', 'CONFIRM', 'CANCEL').then((result) => {
      if (result) {
        this.apiService.delete$('pgr/row/delete', { id }).subscribe({
          next: () => {
            this.toastService.success('ROW_FACTOR_DELETED');
            this.assessmentService.updateHazardAssessmentsState({ rows: this.currentAssessment?.rows?.filter(r => r.id !== id) || [] });
          },
          error: (err) => {
            console.error('Error deleting row factor:', err);
          }
        })
      }
    });
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

  onInsertControlMesure(rowFactor: IRowFactorDto): void {
    this.rowFactorId = rowFactor.id ?? null;
    this.drawerOpen.set(true);
  }

  onDeleteControlMesure(rowFactor: IRowFactorDto) {
    this.modalService.open('CONFIRM', 'DELETE_CONFIRM', 'CONFIRM', 'CANCEL').then((result) => {
      if (result) {
        this.apiService.delete$('pgr/control-measure/delete', { id: rowFactor?.controlMeasure?.id }).subscribe({
          next: () => {
            this.toastService.success('CONTROL_MEASURE_DELETED');
            const rows = this.currentAssessment?.rows?.map(r => r) || [];
            const currentRowfactor = rows.find(r => r.id === rowFactor.id);
            if (currentRowfactor) {
              currentRowfactor.controlMeasure = undefined;
            }
            this.assessmentService.updateHazardAssessmentsState({ rows });
          },
          error: (err) => {
            console.error('Error deleting control measure:', err);
          }
        });
      }
    });
  }

  handleCloseDrawer() {
    this.drawerOpen.set(false);
    this.controlMeasureForm.reset();
    this.selectedEpis = [];
    this.rowFactorId = null;
  }

  onEpiSelected(selectedOption: DropdownOption): void {
    if (!this.selectedEpis.some(epi => epi.id === selectedOption.id))
      this.selectedEpis.push(selectedOption);
  }

  async onEpiSearch(searchTerm: string): Promise<void> {
    const paginationOptions: IPaginationOptions = {
      limit: 100,
      page: 1,
      filter: {
        description: searchTerm
      }
    };
    this.apiService.postData<IPaginatedResponse<IEpiDto>>("epi/find-all", paginationOptions)
      .then(res => {
        this.epiOptions = res.data.map(d => ({
          id: d.id!,
          name: d.name + " | " + d.manufacturer
        }));
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  removeEpi(id: string): void {
    this.selectedEpis = this.selectedEpis.filter(epi => epi.id != id);
  }

  onSaveControlMesures() {
    const { id, ...otherValues } = this.controlMeasureForm.value;

    const hasDataAssigned = Object.values(otherValues).some(value => value !== null && value !== '');
    if (!hasDataAssigned && !this.selectedEpis.length) {
      this.toastService.warning('CONTROL_MEASURE_NOT_FILLED');
      return;
    }
    const controlMesureDto: IControlMeasureInsertDto = {
      administrativeMeasure: this.controlMeasureForm.value.administrativeMeasure ?? undefined,
      epc: this.controlMeasureForm.value.epc ?? undefined,
      epis: this.selectedEpis.map(epi => epi.id.toString()),
      rowFactorId: this.rowFactorId ?? undefined
    }
    this.apiService.postData<IControlMeasureDto>("pgr/control-measure/create", controlMesureDto).then((res: IControlMeasureDto) => {
      this.toastService.success('CONTROL_MEASURE_INSERTED');
      const rows = this.currentAssessment?.rows?.map(r => r) || [];
      const currentRowfactor = rows.find(r => r.id === this.rowFactorId);
      if (currentRowfactor) currentRowfactor.controlMeasure = res;
      this.assessmentService.updateHazardAssessmentsState({ rows });
      this.drawerOpen.set(false);
      this.controlMeasureForm.reset();
      this.selectedEpis = [];
      this.rowFactorId = null;
    }).catch((err) => {
      console.error('Error inserting control measure:', err);
    });
  }

  onEditControlMesure(controlMesure: IControlMeasureDto) {
    if (!controlMesure.id || !controlMesure.rowFactorId) return;
    this.rowFactorId = controlMesure.rowFactorId;
    this.controlMeasureForm.patchValue({
      administrativeMeasure: controlMesure.administrativeMeasure,
      epc: controlMesure.epc,
      id: controlMesure.id,
    });
    this.selectedEpis = controlMesure.epis?.map(epi => ({
      id: epi.id!,
      name: epi.name + " | " + epi.manufacturer
    })) ?? [];
    this.drawerOpen.set(true);
  }
  //#endregion
}
