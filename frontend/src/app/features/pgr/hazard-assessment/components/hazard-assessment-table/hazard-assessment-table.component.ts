import { Component, inject, input, output, signal } from '@angular/core';
import IHazardAssessmentDto from '../../../../../core/http/dtos/IHazardAssessmentDto';
import { ApiService } from '../../../../../core/services/api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import IRowFactorDto from '../../../../../core/http/dtos/IRowFactorDto';
import { IControlMeasureDto } from '../../../../../core/http/dtos/IControlMeasureDto';

@Component({
  selector: 'app-hazard-assessment-table',
  imports: [
    TranslatePipe,
    NgClass,
    FormsModule,
  ],
  templateUrl: './hazard-assessment-table.component.html',
  styleUrl: './hazard-assessment-table.component.scss',
})
export class HazardAssessmentTableComponent {
  // Services
  apiService: ApiService = inject(ApiService);

  // Signals RowFactor
  isEditing = signal<boolean>(false);
  isInserting = signal<boolean>(false);

  // Signals ControlMeasure
  isInsertingControlMesure = signal<boolean>(false);
  isEditingControlMesure = signal<boolean>(false);

  // Signals General
  expandedRows = signal<IRowFactorDto[]>([]);

  // Inputs
  assessment = input<IHazardAssessmentDto>();

  // Outputs RowFactor
  insertRow = output<Partial<IRowFactorDto>>();
  deleteRow = output<number>();

  // Outputs ControlMeasure
  insertControlMesure = output<IControlMeasureDto>();
  deleteControlMesure = output<number>();

  // Form State RowFactor
  newRow: Partial<IRowFactorDto> = { factor: { description: '' } as any };
  editRow: Partial<IRowFactorDto> = { factor: { description: '' } as any };

  // Form State ControlMeasure
  controlMesure: Partial<IControlMeasureDto> = { id: undefined, administrativeMeasures: '', epi: '', epc: '', rowFactorId: undefined };

  // Options
  exposureTimeOptions = [1, 2, 3];
  matrixOptions = [1, 2, 3, 4, 5];

  //#region Factor Rows Methods
  onSaveClick() {
    const rowToEmit = {
      ...this.newRow,
      probability: Number(this.newRow.probability),
      severity: Number(this.newRow.severity)
    };

    this.insertRow.emit(rowToEmit);
    this.isInserting.set(false);
    this.newRow = { factor: { description: '' } as any };
  }

  onDeleteClick(row: IRowFactorDto) { }

  onHeaderDblClick() {
    this.isInserting.set(!this.isInserting());
  }

  onControlMeasureHeaderDblClick() {
    this.isInsertingControlMesure.set(!this.isInsertingControlMesure());
  }

  toggleRow(row: IRowFactorDto) {
    const current = this.expandedRows();
    if (current.includes(row)) {
      this.expandedRows.set(current.filter(r => r !== row));
    } else {
      this.expandedRows.set([...current, row]);
    }
  }

  isRowExpanded(row: IRowFactorDto): boolean {
    return this.expandedRows().includes(row);
  }

  onEditClick(row: IRowFactorDto) {
    this.isEditing.set(!this.isEditing());
    this.newRow = row;
  }

  onCancelClick() {
    this.isEditing.set(false);
    this.newRow = { factor: { description: '' } as any };
  }

  //#endregion

  //#region Control Measures Methods
  onSaveControlMesureClick() {
    this.insertControlMesure.emit(this.controlMesure as IControlMeasureDto);
    this.isInsertingControlMesure.set(false);
    this.isEditingControlMesure.set(false);
    this.controlMesure = { id: undefined, administrativeMeasures: '', epi: '', epc: '', rowFactorId: undefined };
  }

  onInsertControlMesureClick(row: IRowFactorDto) {
    this.controlMesure.rowFactorId = row.id;
    this.isInsertingControlMesure.set(true);
    if (!this.isRowExpanded(row)) {
      this.toggleRow(row);
    }
  }

  onEditControlMesureClick(controlMesure: IControlMeasureDto, rowFactorId: number) {
    this.isEditingControlMesure.set(!this.isEditingControlMesure());
    this.controlMesure = controlMesure;
    this.controlMesure.rowFactorId = rowFactorId;
  }

  onDeleteControlMesureClick(controlMesure: IControlMeasureDto) {
    this.isEditingControlMesure.set(false);
    this.controlMesure = { administrativeMeasures: '', epi: '', epc: '', rowFactorId: undefined };
    this.deleteControlMesure.emit(controlMesure.id ?? -1);
  }

  onCancelEditControlMesureClick(row: IRowFactorDto) {
    if (!row.controlMeasures || row.controlMeasures.length === 0) {
      if (this.isRowExpanded(row)) {
        this.toggleRow(row);
      }
    }
    this.isEditingControlMesure.set(false);
    this.isInsertingControlMesure.set(false);
    this.controlMesure = { id: undefined, administrativeMeasures: '', epi: '', epc: '', rowFactorId: undefined };
  }
  //#endregion

  //#region Rows Helper Methods
  getMatrixEnumString(enumValue: number): string {
    switch (enumValue) {
      case 1:
        return "VERY_LOW";
      case 2:
        return "LOW";
      case 3:
        return "MODERATE";
      case 4:
        return "HIGH";
      case 5:
        return "VERY_HIGH";
      default:
        return "HIGH";
    }
  }

  getExposureTimeEnumString(enumValue: number): string {
    switch (enumValue) {
      case 1:
        return "INTERMITTENT";
      case 2:
        return "OCCASIONAL";
      case 3:
        return "PERMANENT";
      default:
        return "HIGH";
    }
  }

  getRiskString(enumValue: number): string {
    switch (enumValue) {
      case 5:
        return "VERY_HIGH"
      case 4:
        return "HIGH"
      case 3:
        return "MODERATE"
      default:
        return "LOW";
    }
  }
  // End Table Region
}
