import { IControlMeasureDto } from './IControlMeasureDto';
import IFactorDto from './IFactorDto';

export enum ExposureTimeEnum {
  INTERMITTENT = 1,
  OCCASIONAL,
  PERMANENT,
}

export enum MatrixEnum {
  VERY_LOW = 1,
  LOW,
  MODERATE,
  HIGH,
  VERY_HIGH,
}

export default interface IRowFactorDto {
  id?: number;
  factor: IFactorDto;
  intensity: string;
  technique: string;
  source: string;
  exposureTime: ExposureTimeEnum;
  harm: string;
  probability: MatrixEnum;
  severity: MatrixEnum;
  score?: MatrixEnum;
  hazardAssessmentId?: number;
  hazardId?: number;
  controlMeasures?: IControlMeasureDto[];
}
