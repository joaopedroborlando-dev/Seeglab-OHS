import { BaseModel } from "./BaseModel";
import { Column, Entity, OneToMany } from "typeorm";
import { ControlMeasureEpi } from "./ControlMeasureEpi";

@Entity()
export class ControlMeasure extends BaseModel {
    @Column({ type: 'text' })
    administrativeMeasure: string;
    @Column({ type: 'text' })
    epc: string;
    @OneToMany(() => ControlMeasureEpi, cme => cme.controlMeasure)
    epis: ControlMeasureEpi[];
}