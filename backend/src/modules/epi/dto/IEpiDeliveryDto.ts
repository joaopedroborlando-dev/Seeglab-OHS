import { DeliveryStatusEnum } from "../../../database/entity/EpiDelivery";
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
}

export default interface IEpiDeliveryDto {
    id?: number;
    employeeId: number;
    workUnitId?: number;
    deliveredAt: Date;
    status?: DeliveryStatusEnum;
    signatureData?: string;
    signedAt?: Date;
    createdById?: number;
    notes?: string;
    items: IEpiDeliveryItemDto[];
}
