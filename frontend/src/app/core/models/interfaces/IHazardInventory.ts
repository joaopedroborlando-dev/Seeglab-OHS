import { IDepartmentAssessment } from './IDepartmentAssessment';

export interface IHazardInventory {
  id?: number;
  userId?: string;
  description: string;
  createdAt: number | null;
  departmentAssessments: IDepartmentAssessment[];
}
