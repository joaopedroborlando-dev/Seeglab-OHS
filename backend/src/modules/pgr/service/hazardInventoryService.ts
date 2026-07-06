import { AppDataSource } from "../../../database/dataSource";
import IHazardInventoryDto from "../dto/IHzardInventoryDto";
import HazardInventory from "../../../database/entity/HazardInventory";
import { PaginatedResponse, PaginationOptions } from "../../../infra/dto/PaginationDto";
import { getContext } from "../../../context/requestContext";
import { HazardInventoryRepository } from "../repository/hazardInventoryRepository";
import { WorkUnitMapper } from "../mapper/WorkUnitMapper";

const createHazardInventory = async (dto: IHazardInventoryDto): Promise<HazardInventory> => {
    const { organizationId } = getContext();
    const inventory = new HazardInventory();
    if (dto.description) inventory.description = dto.description;
    inventory.name = dto.name;
    inventory.organizationId = organizationId;
    return await AppDataSource.manager.save(inventory);
}

const findAllInventories = async (
    paginationOptions: PaginationOptions
): Promise<PaginatedResponse<IHazardInventoryDto>> => {

    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { organizationId } = getContext();
    const queryBuilder = AppDataSource.getRepository(HazardInventory)
        .createQueryBuilder("inventory")
        .where("inventory.organizationId = :organizationId", { organizationId });
    if (paginationOptions.search) {
        queryBuilder.andWhere("inventory.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("inventory.name", "ASC");

    const total = await queryBuilder.getCount();

    queryBuilder.skip(skip).take(limit);

    const rawResults = await queryBuilder.getMany()

    const inventory = rawResults.map(inventory => {
        {
            return {
                id: inventory?.id,
                name: inventory.name,
                description: inventory.description,
                createdAt: inventory.createdAt,
            }
        }
    });

    const totalPages = Math.ceil(total / limit);

    return {
        data: inventory,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
}

const findOneById = async (id: number): Promise<IHazardInventoryDto> => {
    if (!id) throw new Error("INCORRECT_DATA");
    const { organizationId } = getContext();
    const inventory = await HazardInventoryRepository.findOneById(id, organizationId);

    if (!inventory) throw new Error("INCORRECT_DATA");
    return {
        id: inventory.id,
        name: inventory.name,
        description: inventory.description,
        workUnits: WorkUnitMapper.toDtoList(inventory.workUnits),
    }
}

export {
    createHazardInventory,
    findAllInventories,
    findOneById,
}