import { DeliveryStatusEnum } from "../../../database/entity/EpiDelivery";
import { IEpiDeliveryItemDto } from "./IEpiDeliveryItemDto";

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
