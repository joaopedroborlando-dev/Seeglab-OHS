import { EpiDelivery } from "../../../database/entity/EpiDelivery";
import { EpiDeliveryItem } from "../../../database/entity/EpiDeliveryItem";
import { IEpiDeliveryItemDto } from "../dto/IEpiDeliveryItemDto";

export default class EpiMapper {
    static toDto(item: EpiDeliveryItem, delivery: EpiDelivery): IEpiDeliveryItemDto {
        if (!item) {
            throw new Error('ENTITY_IS_REQUIRED');
        }
        return {
            id: item.id,
            epiId: item.epi?.id,
            caAtDelivery: item.caAtDelivery ?? undefined,
            quantity: item.quantity,
            size: item.size ?? undefined,
            status: item.status ?? undefined,
            expiresAt: item.expiresAt,
            returnedAt: item.returnedAt ?? undefined,
            returnReason: item.returnReason ?? undefined,
            employeeCredencials: delivery.employee?.name,
            workUnitName: delivery.workUnit?.name,
            epiName: item.epi?.name
        }
    }

    static toDtoList(entity: EpiDelivery): IEpiDeliveryItemDto[] {
        if (!entity) {
            return [];
        }
        return entity.items.map(item => this.toDto(item, entity));
    }
}
