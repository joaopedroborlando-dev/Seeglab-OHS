import {IDepartmentAssessment} from '../interfaces/IDepartmentAssessment';
import {IHazardAssessment} from '../interfaces/IHazardAssessment';
import IDepartment from '../interfaces/IDepartment';
import IRole from '../interfaces/IRole';
import {IHazardInventory} from '../interfaces/IHazardInventory';

export class DepartmentAssessment implements IDepartmentAssessment {
  assessments: IHazardAssessment[];
  department: IDepartment;
  inventory: IHazardInventory;
  id: number;
  roles: IRole[];
  constructor(
    assessments: IHazardAssessment[] = [],
    department: IDepartment,
    id: number = 0,
    roles: IRole[] = [],
    inventory: IHazardInventory,
  ) {
    this.assessments = assessments;
    this.department = department;
    this.id = id;
    this.roles = roles;
    this.inventory = inventory;
  }
}
