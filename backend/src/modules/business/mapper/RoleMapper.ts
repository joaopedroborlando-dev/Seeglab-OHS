import Role from "../../../database/entity/Role";
import IRoleDto from "../dto/IRoleDto";

export class RoleMapper {
    static toDto(entity: Role): IRoleDto {
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