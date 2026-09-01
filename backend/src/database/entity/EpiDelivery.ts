import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import Employee from "./Employee";
import { WorkUnit } from "./WorkUnit";
import User from "./User";
import { EpiDeliveryItem } from "./EpiDeliveryItem";

export enum DeliveryStatusEnum {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class EpiDelivery extends BaseModel {
  @ManyToOne(() => Employee)
  employee: Employee;

  @ManyToOne(() => WorkUnit, { nullable: true })
  workUnit: WorkUnit;

  @Column({ type: 'date' })
  deliveredAt: Date;

  @Column({ type: 'varchar', default: DeliveryStatusEnum.PENDING })
  status: DeliveryStatusEnum;

  @Column({ type: 'text', nullable: true })
  signatureData: string | null;

  @Column({ type: 'timestamp', nullable: true })
  signedAt: Date | null;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => EpiDeliveryItem, item => item.delivery, { cascade: true })
  items: EpiDeliveryItem[];
}
