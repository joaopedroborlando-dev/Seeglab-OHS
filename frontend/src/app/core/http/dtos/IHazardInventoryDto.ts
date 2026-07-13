import IWorkUnitDto from './IWorkUnitDto';

export default interface IHazardInventoryDto {
  id?: number;
  name: string;
  description?: string;
  businessId: number;
  createdAt?: Date;
  workUnits?: IWorkUnitDto[];
}
