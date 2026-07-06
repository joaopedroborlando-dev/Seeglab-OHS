import { Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { ControlMeasureEpi } from "./ControlMeasureEpi";

@Entity()
export class Epi extends BaseModel {
    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    caNumber: string;

    @Column({ type: 'date' })
    caExpiration: Date;

    @Column({ type: 'text' })
    manufacturer: string;

    @OneToMany(() => ControlMeasureEpi, cme => cme.epi)
    controlMeasures: ControlMeasureEpi[];
}