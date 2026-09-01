import { Entity, Column, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { EpiDelivery } from "./EpiDelivery";
import { Epi } from "./Epi";

export enum DeliveryItemStatusEnum {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  DISCARDED = 'DISCARDED',
}

@Entity()
export class EpiDeliveryItem extends BaseModel {
  @ManyToOne(() => EpiDelivery, delivery => delivery.items)
  delivery: EpiDelivery;

  @ManyToOne(() => Epi)
  epi: Epi;

  @Column({ type: 'text', nullable: true })
  caAtDelivery: string | null;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  size: string | null;

  @Column({ type: 'varchar', default: DeliveryItemStatusEnum.ACTIVE })
  status: DeliveryItemStatusEnum;

  @Column({ type: 'date' })
  expiresAt: Date;

  @Column({ type: 'date', nullable: true })
  returnedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  returnReason: string | null;
}
