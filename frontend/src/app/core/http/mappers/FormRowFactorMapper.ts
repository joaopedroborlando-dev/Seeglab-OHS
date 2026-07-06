import IRowFactorDto, { ExposureTimeEnum, MatrixEnum } from '../dtos/IRowFactorDto';

export class FormRowFactorMapper {

  static mapRowFactorFormToDto(
    formValue: any,
    assessmentId?: number,
    hazardId?: number,
  ): IRowFactorDto {
    return {
      factor: {
        description: formValue.factor || '',
      },
      intensity: formValue.intensity || '',
      technique: formValue.technique || '',
      source: formValue.source || '',
      exposureTime: FormRowFactorMapper.mapExposureTime(formValue.exposureTime),
      harm: formValue.harm || '',
      probability: FormRowFactorMapper.mapMatrix(formValue.probability),
      severity: FormRowFactorMapper.mapMatrix(formValue.severity),
      hazardAssessmentId: assessmentId,
      hazardId: hazardId,
      id: formValue.id,
    };
  }

  static mapRowFactorToDto(
    row: IRowFactorDto,
    assessmentId?: number,
    hazardId?: number,
  ): IRowFactorDto {
    return {
      factor: {
        description: row.factor.description || '',
        id: row.factor.id,
      },
      intensity: row.intensity || '',
      technique: row.technique || '',
      source: row.source || '',
      exposureTime: row.exposureTime,
      harm: row.harm || '',
      probability: row.probability,
      severity: row.severity,
      hazardAssessmentId: assessmentId,
      hazardId: hazardId,
      id: row.id,
    };
  }

  private static mapExposureTime(value: string | null): ExposureTimeEnum {
    const mapping: Record<string, ExposureTimeEnum> = {
      'INTERMITTENT': ExposureTimeEnum.INTERMITTENT,
      'OCCASIONAL': ExposureTimeEnum.OCCASIONAL,
      'PERMANENT': ExposureTimeEnum.PERMANENT,
    };
    return mapping[value || ''] || ExposureTimeEnum.INTERMITTENT;
  }

  private static mapMatrix(value: string | null): MatrixEnum {
    const mapping: Record<string, MatrixEnum> = {
      'VERY_LOW': MatrixEnum.VERY_LOW,
      'LOW': MatrixEnum.LOW,
      'MODERATE': MatrixEnum.MODERATE,
      'HIGH': MatrixEnum.HIGH,
      'VERY_HIGH': MatrixEnum.VERY_HIGH,
    };
    return mapping[value || ''] || MatrixEnum.VERY_LOW;
  }
}
