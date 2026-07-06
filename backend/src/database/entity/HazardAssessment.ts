import {Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./BaseModel";
import Hazard from "./Hazard";
import {RowFactor} from "./RowFactor";
import {WorkUnit} from "./WorkUnit";

@Entity()
export class HazardAssessment extends BaseModel{

    @ManyToOne(() => Hazard)
    hazard: Hazard;

    @OneToMany(() => RowFactor, rowFactor => rowFactor.hazardAssessment)
    rowFactors: RowFactor[];

    @ManyToOne(() => WorkUnit, workUnit => workUnit.hazardAssessments)
    workUnit: WorkUnit;
}