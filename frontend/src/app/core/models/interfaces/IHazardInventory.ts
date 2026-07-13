import { IDepartmentAssessment } from './IDepartmentAssessment';

export interface IHazardInventory {
  id?: number;
  userId?: string;
  name: string;
  description: string | null;
  createdAt: number | null;
  departmentAssessments: IDepartmentAssessment[];
}
