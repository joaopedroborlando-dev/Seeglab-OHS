import { DeliveryItemStatusEnum } from "../../../database/entity/EpiDeliveryItem";

export interface IEpiDeliveryItemDto {
    id?: number;
    epiId: number;
    caAtDelivery?: string;
    quantity: number;
    size?: string;
    status?: DeliveryItemStatusEnum;
    expiresAt?: Date;
    returnedAt?: Date;
    returnReason?: string;
    employeeCredencials?: string;
    workUnitName?: string;
    epiName?: string;
    deliveryDate?: Date;
}