import { AppDataSource } from "../../../database/dataSource";
import Department from "../../../database/entity/Department";
import IRoleDto from "../dto/IRoleDto";
import Role from "../../../database/entity/Role";
import { PaginatedResponse, PaginationOptions } from "../../../infra/dto/PaginationDto";
import { getManyPaginated, IPaginationResponse } from "../../../util/paginationHelper";
import { getContext } from "../../../context/requestContext";

const createRole = async (dto: IRoleDto): Promise<Role> => {
    const role = new Role();
    const department = await AppDataSource.manager.findOneBy(Department, {
        id: dto.departmentId,
    });
    if (!department) throw new Error("NO_DEPARTMENT_FOUND");
    const { organizationId } = getContext();
    role.description = dto.description ?? "";
    role.name = dto.name ?? "";
    role.department = department;
    role.organizationId = organizationId;
    return await AppDataSource.manager.save(role);
}

const updateRole = async (dto: IRoleDto): Promise<Role> => {
    if (!dto.id || !dto.description || !dto.name) throw new Error("INVALID_DATA");
    const { organizationId } = getContext();
    const role = await AppDataSource.manager.findOneBy(Role, {
        id: dto.id,
        organizationId,
    });
    if (!role) throw new Error("DEPARTMENT_NOT_FOUND");

    role.description = dto.description;
    role.name = dto.name;

    if (dto.departmentId) {
        const department = await AppDataSource.manager.findOneBy(Department, {
            id: dto.departmentId,
        });
        if (department) role.department = department;
    }
    return await AppDataSource.manager.save(role);
}

const findAllRoles = async (
    paginationOptions: PaginationOptions
): Promise<PaginatedResponse<IRoleDto>> => {
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { organizationId } = getContext();
    const queryBuilder = AppDataSource.getRepository(Role)
        .createQueryBuilder("role")
        .leftJoinAndSelect("role.department", "department")
        .where("role.organizationId = :organizationId", { organizationId });

    if (paginationOptions.search) {
        queryBuilder.andWhere("role.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("role.name", "ASC");

    const total = await queryBuilder.getCount();

    queryBuilder.skip(skip).take(limit);

    const rawResults = await queryBuilder.getMany()

    const roles = rawResults.map(role => {
        {
            return {
                id: role.id,
                description: role.description,
                departmentId: role.department?.id ?? null,
                name: role.name,
            }
        }
    });

    const totalPages = Math.ceil(total / limit);

    return {
        data: roles,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

const findAllRolesByDepartmentId = async (
    paginationOptions: PaginationOptions,
    departmentId: number
): Promise<IPaginationResponse<IRoleDto>> => {
    const { organizationId } = getContext();
    const queryBuilder = AppDataSource.getRepository(Role)
        .createQueryBuilder("role")
        .leftJoinAndSelect("role.department", "department")
        .where("department.id = :departmentId", { departmentId })
        .andWhere("role.organizationId= :organizationId", { organizationId })
    if (paginationOptions.search) {
        queryBuilder.andWhere("role.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("role.name", "ASC");
    const results = await getManyPaginated(
        paginationOptions,
        queryBuilder
    )
    return {
        meta: results.meta,
        data: results.data.map((role) => {
            return {
                id: role.id,
                description: role.description,
                name: role.name,
            }
        })
    };
}

export {
    createRole,
    updateRole,
    findAllRoles,
    findAllRolesByDepartmentId,
}