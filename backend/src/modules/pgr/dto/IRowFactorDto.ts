import IFactorDto from "./IFactorDto";
import { ExposureTimeEnum, MatrixEnum } from "../../../database/entity/RowFactor";
import IControlMeasureDto from "./IControlMeasureDto";

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
    hazardAssessmentId?: number;
    score?: MatrixEnum;
    hazardId?: number;
    controlMeasure?: IControlMeasureDto;
}