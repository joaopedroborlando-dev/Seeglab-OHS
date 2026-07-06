import IWorkUnitDto from "./IWorkUnitDto";

export default interface IHazardInventoryDto {
    id?: number;
    description?: string;
    name: string;
    createdAt?: Date;
    workUnits?: IWorkUnitDto[];
}