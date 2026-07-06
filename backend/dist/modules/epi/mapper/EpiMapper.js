"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EpiMapper {
    static toDto(entity) {
        if (!entity) {
            throw new Error('ENTITY_IS_REQUIRED');
        }
        return {
            id: entity.epi.id,
            name: entity.epi.name,
            caNumber: entity.epi.caNumber,
            caExpiration: entity.epi.caExpiration,
            manufacturer: entity.epi.manufacturer
        };
    }
    static toDtoList(entities) {
        if (!entities) {
            return [];
        }
        return entities.map(entity => this.toDto(entity));
    }
}
exports.default = EpiMapper;
