import Factor from "../../../database/entity/Factor";
import IFactorDto from "../dto/IFactorDto";

export default class FactorMapper {
    static toDto(entity: Factor): IFactorDto {
        if (!entity) {
            throw new Error('Factor entity is required');
        }

        return {
            id: entity?.id,
            description: entity?.description,
        };
    }

    static toDtoList(entities: Factor[]): IFactorDto[] {
        return entities.map(entity => this.toDto(entity));
    }
}