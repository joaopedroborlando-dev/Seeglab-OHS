import { AppDataSource } from "../../../database/dataSource";
import Employee from "../../../database/entity/Employee";
import Role from "../../../database/entity/Role";
import IEmployeeDto from "../dto/IEmployeeDto";
import { PaginationOptions } from "../../../infra/dto/PaginationDto";
import { IPaginationResponse } from "../../../util/paginationHelper";
import { getContext } from "../../../context/requestContext";
import { EmployeeMapper } from "../mapper/EmployeeMapper";
import { In } from "typeorm";

const createEmployee = async (dto: IEmployeeDto): Promise<Employee> => {
    const employee = new Employee();
    const { organizationId } = getContext();

    employee.name = dto.name ?? "";
    employee.birthDate = dto.birthDate ? new Date(dto.birthDate) : null;
    employee.maritalStatus = dto.maritalStatus ?? null;
    employee.CPF = dto.CPF ?? null;
    employee.PIS = dto.PIS ?? null;
    employee.post = dto.post ?? null;
    employee.organizationId = organizationId;

    if (dto.roleIds && dto.roleIds.length > 0) {
        const roles = await AppDataSource.getRepository(Role).findBy({
            id: In(dto.roleIds)
        });
        employee.roles = roles;
    }

    return await AppDataSource.manager.save(employee);
}

const updateEmployee = async (dto: IEmployeeDto): Promise<Employee> => {
    if (!dto.id) throw new Error("INVALID_DATA");
    const { organizationId } = getContext();
    
    const employee = await AppDataSource.manager.findOne(Employee, {
        where: { id: dto.id, organizationId },
        relations: ["roles"]
    });
    
    if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");

    if (dto.name) employee.name = dto.name;
    if (dto.birthDate !== undefined) employee.birthDate = dto.birthDate ? new Date(dto.birthDate) : null;
    if (dto.maritalStatus !== undefined) employee.maritalStatus = dto.maritalStatus;
    if (dto.CPF !== undefined) employee.CPF = dto.CPF;
    if (dto.PIS !== undefined) employee.PIS = dto.PIS;
    if (dto.post !== undefined) employee.post = dto.post;

    if (dto.roleIds) {
        const roles = await AppDataSource.getRepository(Role).findBy({
            id: In(dto.roleIds)
        });
        employee.roles = roles;
    }

    return await AppDataSource.manager.save(employee);
}

const findAllEmployees = async (
    paginationOptions: PaginationOptions
): Promise<IPaginationResponse<IEmployeeDto>> => {
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { organizationId } = getContext();
    
    const queryBuilder = AppDataSource.getRepository(Employee)
        .createQueryBuilder("employee")
        .leftJoinAndSelect("employee.roles", "role")
        .where("employee.organizationId = :organizationId", { organizationId });

    if (paginationOptions.search) {
        queryBuilder.andWhere("employee.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    
    queryBuilder.addOrderBy("employee.name", "ASC");

    const total = await queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);

    const rawResults = await queryBuilder.getMany();
    const employees = rawResults.map(emp => EmployeeMapper.toDto(emp));

    const totalPages = Math.ceil(total / limit);

    return {
        data: employees,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

const deleteEmployee = async (id: number): Promise<void> => {
    const { organizationId } = getContext();
    const employee = await AppDataSource.manager.findOneBy(Employee, { id, organizationId });
    if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");
    await AppDataSource.manager.remove(employee);
}

export {
    createEmployee,
    updateEmployee,
    findAllEmployees,
    deleteEmployee
}
