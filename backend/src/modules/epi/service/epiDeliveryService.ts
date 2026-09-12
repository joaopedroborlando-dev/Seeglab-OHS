import { getContext } from "../../../context/requestContext";
import { AppDataSource } from "../../../database/dataSource";
import { EpiDelivery } from "../../../database/entity/EpiDelivery";
import { EpiDeliveryItem } from "../../../database/entity/EpiDeliveryItem";
import { PaginationOptions } from "../../../infra/dto/PaginationDto";
import IEpiDeliveryDto from "../dto/IEpiDeliveryDto";
import EpiDeliveryItemMapper from "../mapper/EpiDeliveryItemMapper";
import { EpiDeliveryRepository } from "../repository/epiDeliveryRepository";

const getDeliveryContext = async (inventoryId: number) => {
    return await EpiDeliveryRepository.getDeliveryContext(inventoryId);
}

const getRecommendations = async (workUnitId: number) => {
    return await EpiDeliveryRepository.getRecommendations(workUnitId);
}

const getWorkUnitByEmployeeId = async (employeeId: number) => {
    return await EpiDeliveryRepository.getWorkUnitByEmployeeId(employeeId);
}

const createDelivery = async (dto: IEpiDeliveryDto): Promise<EpiDelivery> => {
    const delivery = new EpiDelivery();
    const { organizationId } = getContext();
    delivery.organizationId = organizationId;
    delivery.employee = { id: dto.employeeId } as any;
    if (dto.workUnitId) {
        delivery.workUnit = { id: dto.workUnitId } as any;
    }
    delivery.deliveredAt = dto.deliveredAt;
    if (dto.status) delivery.status = dto.status;
    delivery.signatureData = dto.signatureData ?? null;
    delivery.signedAt = dto.signedAt ?? null;
    if (dto.createdById) {
        delivery.createdBy = { id: dto.createdById } as any;
    }
    delivery.notes = dto.notes ?? null;

    delivery.items = dto.items.map(itemDto => {
        if (!itemDto.expiresAt) throw new Error("BAD_RESOURCE");

        const item = new EpiDeliveryItem();
        item.epi = { id: itemDto.epiId } as any;
        item.caAtDelivery = itemDto.caAtDelivery ?? null;
        item.quantity = itemDto.quantity;
        item.size = itemDto.size ?? null;
        if (itemDto.status) item.status = itemDto.status;
        item.expiresAt = itemDto.expiresAt;
        item.returnedAt = itemDto.returnedAt ?? null;
        item.returnReason = itemDto.returnReason ?? null;
        item.organizationId = organizationId;
        return item;
    });

    const savedDelivery = await EpiDeliveryRepository.save(delivery);
    return savedDelivery;
}

const findAllEpiDeliveries = async (paginationOptions: PaginationOptions) => {
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { organizationId } = getContext();
    const { filter } = paginationOptions;

    const queryBuilder = AppDataSource.getRepository(EpiDelivery)
        .createQueryBuilder("delivery")
        .innerJoinAndSelect("delivery.employee", "employee")
        .leftJoinAndSelect("delivery.workUnit", "workUnit")
        .innerJoinAndSelect("delivery.items", "items")
        .innerJoinAndSelect("items.epi", "epi")
        .where("delivery.organizationId = :organizationId", { organizationId })

    const { employeeCredencials, expirationDate, workUnitId } = filter || {};

    if (employeeCredencials) {
        queryBuilder.andWhere("employee.name ILIKE :employeeCredencials", {
            employeeCredencials: `%${employeeCredencials}%`
        });
    }

    if (workUnitId) {
        queryBuilder.andWhere("delivery.workUnitId = :workUnitId", {
            workUnitId
        });
    }

    if (expirationDate) {
        queryBuilder.andWhere("items.expiresAt >= :expirationDate", {
            expirationDate
        });
    }

    queryBuilder.skip(skip).take(limit);

    const total = await queryBuilder.getCount();
    const rawResult = await queryBuilder.getMany();
    const totalPages = Math.ceil(total / limit);
    const data = rawResult.flatMap(r => EpiDeliveryItemMapper.toDtoList(r));
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    }
}

export {
    getDeliveryContext,
    getRecommendations,
    getWorkUnitByEmployeeId,
    createDelivery,
    findAllEpiDeliveries,
}
