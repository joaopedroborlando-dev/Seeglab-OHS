import { WorkUnit } from "../../../database/entity/WorkUnit";
import IWorkUnitDto from "../dto/IWorkUnitDto";
import { RoleMapper } from "../../business/mapper/RoleMapper";
import { HazardAssessmentMapper } from "./HazardAssessmentMapper";

export class WorkUnitMapper {
    static toDto(entity: WorkUnit): IWorkUnitDto {
        if (!entity) {
            throw new Error('WorkUnit entity is required');
        }

        return {
            id: entity.id,
            name: entity.name,
            departmentId: entity.department?.id,
            inventoryId: entity.inventory?.id,
            inventoryName: entity.inventory?.name,
            departmentName: entity.department?.name,
            inventoryDescription: entity.inventory?.description,
            departmentDescription: entity.department?.description,
            roles: entity.roles?.map(role => RoleMapper.toDto(role)) || [],
            hazardAssessments: entity.hazardAssessments?.map(assessment =>
                HazardAssessmentMapper.toDto(assessment)
            ) || [],
        };
    }

    static toDtoList(entities: WorkUnit[]): IWorkUnitDto[] {
        return entities.map(entity => this.toDto(entity));
    }
}