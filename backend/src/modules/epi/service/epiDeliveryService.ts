import { getContext } from "../../../context/requestContext";
import { EpiDelivery } from "../../../database/entity/EpiDelivery";
import { EpiDeliveryItem } from "../../../database/entity/EpiDeliveryItem";
import IEpiDeliveryDto from "../dto/IEpiDeliveryDto";
import { EpiDeliveryRepository } from "../repository/epiDeliveryRepository";

export const getDeliveryContext = async (inventoryId: number) => {
    return await EpiDeliveryRepository.getDeliveryContext(inventoryId);
}

export const getRecommendations = async (workUnitId: number) => {
    return await EpiDeliveryRepository.getRecommendations(workUnitId);
}

export const getWorkUnitByEmployeeId = async (employeeId: number) => {
    return await EpiDeliveryRepository.getWorkUnitByEmployeeId(employeeId);
}

export const createDelivery = async (dto: IEpiDeliveryDto): Promise<EpiDelivery> => {
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
