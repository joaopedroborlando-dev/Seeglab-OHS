import {HazardAssessment} from "../../../database/entity/HazardAssessment";
import IHazardAssessmentDto from "../dto/IHazardAssessmentDto";
import HazardMapper from "../../business/mapper/HazardMapper";
import RowFactorMapper from "./RowFactorMapper";

export class HazardAssessmentMapper {

    static toDto(entity:HazardAssessment):IHazardAssessmentDto{
        if (!entity) {
            throw new Error('WorkUnit entity is required');
        }
        return {
            id: entity.id,
            hazard: HazardMapper.toDto(entity.hazard),
            rows: entity.rowFactors?.map(row => RowFactorMapper.toDto(row)) || [],
        };
    }
}