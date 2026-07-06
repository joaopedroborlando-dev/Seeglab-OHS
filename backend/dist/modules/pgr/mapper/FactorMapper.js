"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FactorMapper {
    static toDto(entity) {
        if (!entity) {
            throw new Error('Factor entity is required');
        }
        return {
            id: entity === null || entity === void 0 ? void 0 : entity.id,
            description: entity === null || entity === void 0 ? void 0 : entity.description,
        };
    }
    static toDtoList(entities) {
        return entities.map(entity => this.toDto(entity));
    }
}
exports.default = FactorMapper;
