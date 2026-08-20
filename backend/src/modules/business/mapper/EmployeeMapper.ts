import Employee from "../../../database/entity/Employee";
import IEmployeeDto from "../dto/IEmployeeDto";
import { RoleMapper } from "./RoleMapper";

export class EmployeeMapper {
    static toDto(entity: Employee): IEmployeeDto {
        if (!entity) {
            throw new Error('Employee entity is required');
        }

        return {
            id: entity.id,
            name: entity.name,
            birthDate: entity.birthDate ?? undefined,
            maritalStatus: entity.maritalStatus ?? undefined,
            CPF: entity.CPF ?? undefined,
            PIS: entity.PIS ?? undefined,
            post: entity.post ?? undefined,
            roles: entity.roles ? entity.roles.map(r => RoleMapper.toDto(r)) : [],
        };
    }
}
