import { Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import { ControlMeasure } from "./ControlMeasure";
import { Epi } from "./Epi";

@Entity()
export class ControlMeasureEpi extends BaseModel {
    @ManyToOne(() => ControlMeasure, cm => cm.epis)
    controlMeasure: ControlMeasure;

    @ManyToOne(() => Epi, epi => epi.controlMeasures)
    epi: Epi;
}
