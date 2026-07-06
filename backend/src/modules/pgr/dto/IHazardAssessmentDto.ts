import IHazardDto from "./IHazardDto";
import IRowFactorDto from "./IRowFactorDto";

export default interface IHazardAssessmentDto{
    id?: number;
    hazard: IHazardDto;
    rows?:IRowFactorDto[];
    workUnitId?: number;
}