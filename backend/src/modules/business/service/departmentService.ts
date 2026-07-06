import { AppDataSource } from "../../../database/dataSource";
import IDepartmentDto from "../dto/IDepartmentDto";
import Department from "../../../database/entity/Department";
import { PaginatedResponse, PaginationOptions } from "../../../infra/dto/PaginationDto";
import { getContext } from "../../../context/requestContext";

const createDepartment = async (dto: IDepartmentDto): Promise<Department> => {
    const { organizationId } = getContext();
    const department = new Department();
    department.description = dto.description ?? "";
    department.name = dto.name ?? "";
    department.organizationId = organizationId;
    return await AppDataSource.manager.save(department);
}

const updateDepartment = async (dto: IDepartmentDto): Promise<Department> => {
    if (!dto.id || !dto.description || !dto.name) throw new Error("Incorrect id or description");
    const { organizationId } = getContext();
    const department = await AppDataSource.manager.findOneBy(Department, {
        id: dto.id,
        organizationId: organizationId,
    });
    if (!department) throw new Error("Department not found");
    department.description = dto.description;
    department.name = dto.name;
    return await AppDataSource.manager.save(department);
}

const findAllDepartments = async (
    paginationOptions: PaginationOptions,
): Promise<PaginatedResponse<IDepartmentDto>> => {
    const { organizationId } = getContext();
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const queryBuilder = AppDataSource.getRepository(Department)
        .createQueryBuilder("department")
        .where("department.organizationId= :organizationId", { organizationId });

    if (paginationOptions.search) {
        queryBuilder.andWhere("department.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("department.name", "ASC");

    const total = await queryBuilder.getCount();

    queryBuilder.skip(skip).take(limit);

    const rawResults = await queryBuilder.getMany()

    const departments = rawResults.map(department => {
        {
            return {
                id: department.id,
                description: department.description,
                name: department.name,
            }
        }
    });

    const totalPages = Math.ceil(total / limit);

    return {
        data: departments,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

export {
    createDepartment,
    updateDepartment,
    findAllDepartments,
};