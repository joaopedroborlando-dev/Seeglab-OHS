import IEpiDto from "../../epi/dto/IEpiDto";

export default interface IControlMeasureDto {
    id?: number;
    rowFactorId?: number;
    administrativeMeasure?: string;
    epis?: IEpiDto[];
    epc?: string;
}
