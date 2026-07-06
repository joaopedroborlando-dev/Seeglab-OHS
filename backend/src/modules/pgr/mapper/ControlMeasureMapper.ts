import { ControlMeasure } from "../../../database/entity/ControlMeasure";
import IControlMeasureDto from "../dto/IControlMeasureDto";
import EpiMapper from "../../epi/mapper/EpiMapper";

export default class ControlMeasureMapper {
    static toDto(entity: ControlMeasure): IControlMeasureDto {
        if (!entity) {
            throw new Error('ENTITY_IS_REQUIRED');
        }

        return {
            id: entity.id,
            epc: entity.epc,
            epis: EpiMapper.toDtoList(entity.epis),
            administrativeMeasure: entity.administrativeMeasure
        };
    }
}