import IRoleDto from './IRoleDto';
import IHazardAssessmentDto from './IHazardAssessmentDto';

export default interface IWorkUnitDto {
  id?: number;
  departmentId?:number;
  inventoryId?: number;
  roles?: IRoleDto[];
  departmentDescription?: string;
  inventoryDescription?: string;
  hazardAssessments?: IHazardAssessmentDto[];
}
