"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HazardMapper {
    static toDto(entity) {
        if (!entity) {
            throw new Error('Hazard entity is required');
        }
        return {
            id: entity === null || entity === void 0 ? void 0 : entity.id,
            description: entity === null || entity === void 0 ? void 0 : entity.description,
            color: entity === null || entity === void 0 ? void 0 : entity.color,
        };
    }
    static toDtoList(entities) {
        return entities.map(el => this.toDto(el));
    }
}
exports.default = HazardMapper;
