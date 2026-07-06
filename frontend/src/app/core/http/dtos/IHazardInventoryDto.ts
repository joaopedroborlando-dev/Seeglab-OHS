import IWorkUnitDto from './IWorkUnitDto';

export default interface IHazardInventoryDto {
  id?: number;
  description: string;
  businessId: number;
  createdAt?: Date;
  workUnits?: IWorkUnitDto[];
}
