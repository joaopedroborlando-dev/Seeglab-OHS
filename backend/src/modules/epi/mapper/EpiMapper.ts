import { ControlMeasureEpi } from "../../../database/entity/ControlMeasureEpi";
import IEpiDto from "../../epi/dto/IEpiDto";

export default class EpiMapper {
    static toDto(entity: ControlMeasureEpi): IEpiDto {
        if (!entity) {
            throw new Error('ENTITY_IS_REQUIRED');
        }
        return {
            id: entity.epi.id,
            name: entity.epi.name,
            caNumber: entity.epi.caNumber,
            caExpiration: entity.epi.caExpiration,
            manufacturer: entity.epi.manufacturer
        }
    }

    static toDtoList(entities: ControlMeasureEpi[]): IEpiDto[] {
        if (!entities) {
            return [];
        }
        return entities.map(entity => this.toDto(entity));
    }
}
