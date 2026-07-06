import { RowFactor } from "../../../database/entity/RowFactor";
import IRowFactorDto from "../dto/IRowFactorDto";
import FactorMapper from "./FactorMapper";
import ControlMeasureMapper from "./ControlMeasureMapper";

export default class RowFactorMapper {
    static toDto(entity: RowFactor): IRowFactorDto {
        if (!entity) {
            throw new Error('RowFactor entity is required');
        }

        return {
            id: entity.id,
            factor: FactorMapper.toDto(entity.factor),
            intensity: entity.intensity,
            technique: entity.technique,
            source: entity.source,
            exposureTime: entity.exposureTime,
            harm: entity.harm,
            probability: entity.probability,
            severity: entity.severity,
            hazardAssessmentId: entity.hazardAssessment?.id,
            score: entity.score,
            controlMeasure: entity.controlMeasure ? ControlMeasureMapper.toDto(entity.controlMeasure) : undefined,
        };
    }
}