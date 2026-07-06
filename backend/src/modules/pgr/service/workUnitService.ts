import { AppDataSource } from "../../../database/dataSource";
import IWorkUnitDto from "../dto/IWorkUnitDto";
import HazardInventory from "../../../database/entity/HazardInventory";
import Department from "../../../database/entity/Department";
import Role from "../../../database/entity/Role";
import { WorkUnit } from "../../../database/entity/WorkUnit";
import { In } from "typeorm";
import { WorkUnitMapper } from "../mapper/WorkUnitMapper";
import { getContext } from "../../../context/requestContext";
import { WorkUnitRepository } from "../repository/workUnitRepository";

const findManyByInventoryId = async (id: number): Promise<IWorkUnitDto[]> => {
    if (!id) throw new Error("Incorrect data");
    const workUnits = await WorkUnitRepository.findByInventoryId(id);
    return WorkUnitMapper.toDtoList(workUnits);
};

const createWorkUnit = async (dto: IWorkUnitDto): Promise<IWorkUnitDto> => {
    const { organizationId } = getContext();

    const [inventory, department] = await Promise.all([
        AppDataSource.manager.findOneBy(HazardInventory, { id: dto.inventoryId }),
        AppDataSource.manager.findOneBy(Department, { id: dto.departmentId }),
    ]);

    if (!inventory || !department) throw new Error("BAD_RESOURCE");
    if (!dto.name) throw new Error("BAD_RESOURCE");

    const roles = await AppDataSource.getRepository(Role).findBy({
        id: In(dto.roles?.map((r) => r.id) ?? []),
    });

    const workUnit = Object.assign(new WorkUnit(), {
        department,
        inventory,
        roles,
        organizationId,
        name: dto.name,
        code: dto.code ?? null,
    });

    const saved = await AppDataSource.manager.save(workUnit);

    return WorkUnitMapper.toDto(saved);
};

const updateWorkUnit = async (id: number, dto: Partial<IWorkUnitDto>): Promise<IWorkUnitDto> => {
    const workUnit = await WorkUnitRepository.findByIdWithRoles(id);
    if (!workUnit) throw new Error("NOT_FOUND");

    if (dto.name !== undefined) workUnit.name = dto.name;
    if (dto.code !== undefined) workUnit.code = dto.code ?? null;

    if (dto.roles !== undefined) {
        workUnit.roles = await AppDataSource.getRepository(Role).findBy({
            id: In(dto.roles.map((r) => r.id)),
        });
    }

    if (dto.departmentId !== undefined) {
        const department = await AppDataSource.manager.findOneBy(Department, { id: dto.departmentId });
        if (!department) throw new Error("BAD_RESOURCE");
        workUnit.department = department;
    }

    const saved = await AppDataSource.manager.save(workUnit);
    return WorkUnitMapper.toDtoList([saved])[0];
};

const deleteById = async (id: number): Promise<boolean> => {
    if (!id) throw new Error("Incorrect data");

    const workUnit = await WorkUnitRepository.findByIdWithRoles(id);
    if (!workUnit) throw new Error("NOT_FOUND");

    workUnit.roles = [];
    await WorkUnitRepository.save(workUnit);
    await WorkUnitRepository.remove(workUnit);

    return true;
};

const findLastUpdatedWorkUnit = async (): Promise<IWorkUnitDto[]> => {
    const { organizationId } = getContext();

    const lastUnit = await WorkUnitRepository.findLastUpdatedInventoryId();
    if (!lastUnit) return [];

    const workUnits = await WorkUnitRepository.findByInventoryIdWithAssessments(
        lastUnit.inventory.id,
        organizationId
    );

    return WorkUnitMapper.toDtoList(workUnits);
};

const findRelatedWorkUnits = async (id: number): Promise<IWorkUnitDto[]> => {
    const workUnit = await WorkUnitRepository.findOne({
        where: { id },
        relations: ["inventory"],
    });

    if (!workUnit) return [];

    const related = await WorkUnitRepository.findRelatedByInventoryId(
        workUnit.inventory.id,
        id
    );

    return WorkUnitMapper.toDtoList(related);
};

export {
    findManyByInventoryId,
    createWorkUnit,
    updateWorkUnit,
    deleteById,
    findLastUpdatedWorkUnit,
    findRelatedWorkUnits,
};