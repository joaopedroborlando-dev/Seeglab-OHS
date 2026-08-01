import { Component, inject, input, output, signal } from '@angular/core';
import IHazardAssessmentDto from '../../../../../../../core/http/dtos/IHazardAssessmentDto';
import { ApiService } from '../../../../../../../core/services/api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import IRowFactorDto from '../../../../../../../core/http/dtos/IRowFactorDto';
import { IControlMeasureDto } from '../../../../../../../core/http/dtos/IControlMeasureDto';
import { ToastService } from '../../../../../../../core/services/toast.service';

@Component({
  selector: 'app-hazard-assessment-table',
  imports: [
    TranslatePipe,
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './hazard-assessment-table.component.html',
  styleUrl: './hazard-assessment-table.component.scss',
})
export class HazardAssessmentTableComponent {
  // Services
  apiService: ApiService = inject(ApiService);
  toastService: ToastService = inject(ToastService);

  // Signals General
  expandedRows = signal<IRowFactorDto[]>([]);

  // Inputs
  assessment = input<IHazardAssessmentDto>();

  // Outputs RowFactor
  editRowFactor = output<IRowFactorDto>();
  deleteRowFactor = output<number>();

  // Outputs ControlMeasure
  editControlMesure = output<IControlMeasureDto>();
  deleteControlMesure = output<number>();
  insertControlMesure = output<void>();

  // Form State ControlMeasure
  controlMesure: Partial<IControlMeasureDto> = { id: undefined, administrativeMeasure: '', epc: '', rowFactorId: undefined };

  // Options
  exposureTimeOptions = [1, 2, 3];
  matrixOptions = [1, 2, 3, 4, 5];

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

  //#region RowFactor 
  onEditClick(row: IRowFactorDto) {
    this.editRowFactor.emit(row);
  }

  onDeleteClick(row: IRowFactorDto) {
    if (row.id)
      this.deleteRowFactor.emit(row.id);
  }

  //#endregion

  //#region ControlMeasure
  onEditControlMesureClick(controlMesure: Partial<IControlMeasureDto>) {

  }
  onDeleteControlMesureClick(controlMesure: IControlMeasureDto) {

  }

  onInsertControlMesureClick(row: IRowFactorDto) {
    this.insertControlMesure.emit();
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
        return "PERMANENT";
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
