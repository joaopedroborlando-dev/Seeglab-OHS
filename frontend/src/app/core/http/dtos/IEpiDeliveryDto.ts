export interface IEpiDeliveryItemDto {
    id?: number;
    epiId: number;
    epiName?: string;
    caAtDelivery?: string;
    quantity: number;
    size?: string;
    status?: string;
    expiresAt?: Date;
    returnedAt?: Date;
    returnReason?: string;
}

export default interface IEpiDeliveryDto {
    id?: number;
    employeeId: number;
    workUnitId?: number;
    deliveredAt: Date;
    status?: string;
    signatureData?: string;
    signedAt?: Date;
    createdById?: number;
    notes?: string;
    items: IEpiDeliveryItemDto[];
}
