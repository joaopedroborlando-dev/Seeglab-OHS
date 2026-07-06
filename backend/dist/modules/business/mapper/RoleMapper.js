"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMapper = void 0;
class RoleMapper {
    static toDto(entity) {
        if (!entity) {
            throw new Error('Role entity is required');
        }
        return {
            id: entity.id,
            description: entity.description,
            name: entity.name,
        };
    }
}
exports.RoleMapper = RoleMapper;
