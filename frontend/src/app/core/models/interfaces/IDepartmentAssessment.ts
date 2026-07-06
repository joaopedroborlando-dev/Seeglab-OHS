import IRole from './IRole';
import {IHazardAssessment} from './IHazardAssessment';
import IDepartment from './IDepartment';
import {IHazardInventory} from './IHazardInventory';

export interface IDepartmentAssessment {
  id?:number;
  department: IDepartment;
  roles?: IRole[];
  assessments?: IHazardAssessment[];
  inventory?: IHazardInventory;
}
