import { Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { WorkUnit } from "./WorkUnit";

@Entity()
export default class HazardInventory extends BaseModel {

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => WorkUnit, unit => unit.inventory)
    workUnits: WorkUnit[];
}