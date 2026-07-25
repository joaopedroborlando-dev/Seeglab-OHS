import IWorkUnitDto from './IWorkUnitDto';

export default interface IHazardInventoryDto {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  workUnits?: IWorkUnitDto[];
}
