import IRoleDto from "../../business/dto/IRoleDto";
import IHazardAssessmentDto from "./IHazardAssessmentDto";

export default interface IWorkUnitDto {
    id?: number;
    departmentId?: number;
    inventoryId?: number;
    roles?: IRoleDto[];
    departmentDescription?: string;
    departmentName?: string;
    hazardAssessments?: IHazardAssessmentDto[];
    inventoryDescription?: string;
    inventoryName?: string;
    name?: string;
    code?: string | null;
}
