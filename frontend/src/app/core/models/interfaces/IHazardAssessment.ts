import {IFactor} from './IFactor';
import {IHazard} from './IHazard';

export interface IHazardAssessment {
  id:number;
  hazard: IHazard;
  factors: IRowFactors[] | [];
}

interface IRowFactors {
  factor: IFactor;
  intensity:string;
  technique:string;
  source:string;
  exposureTime:ExposureTimeEnum;
  harm:string;
  probability:MatrixEnum;
  severity:MatrixEnum;
}

enum ExposureTimeEnum {
  INTERMITTENT,
  OCCASIONAL,
  PERMANENT,
}

enum MatrixEnum {
  VERY_LOW ,
  LOW,
  MODERATE,
  HIGH,
  VERY_HIGH,
}
