import IHazardDto from "../../pgr/dto/IHazardDto";
import Hazard from "../../../database/entity/Hazard";

export default class HazardMapper{
    static toDto(entity: Hazard): IHazardDto {
        if (!entity) {
            throw new Error('Hazard entity is required');
        }

        return {
            id: entity?.id,
            description: entity?.description,
            color: entity?.color,
        };
    }

    static toDtoList(entities: Hazard[]): IHazardDto[] {
        return entities.map(el => this.toDto(el));
    }
}