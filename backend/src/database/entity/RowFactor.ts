import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import Factor from "./Factor";
import { HazardAssessment } from "./HazardAssessment";
import { ControlMeasure } from "./ControlMeasure";

export enum ExposureTimeEnum {
    INTERMITTENT = 1,
    OCCASIONAL,
    PERMANENT,
}

export enum MatrixEnum {
    VERY_LOW = 1,
    LOW,
    MODERATE,
    HIGH,
    VERY_HIGH,
}
@Entity()
export class RowFactor extends BaseModel {
    @ManyToOne(() => Factor)
    factor: Factor;
    @Column({ type: 'text' })
    intensity: string;
    @Column({ type: 'text' })
    technique: string;
    @Column({ type: 'text' })
    source: string;
    @Column({ type: 'enum', enum: ExposureTimeEnum })
    exposureTime: ExposureTimeEnum;
    @Column({ type: 'text' })
    harm: string;
    @Column({ type: 'enum', enum: MatrixEnum })
    probability: MatrixEnum;
    @Column({ type: 'enum', enum: MatrixEnum })
    severity: MatrixEnum;
    @ManyToOne(() => HazardAssessment, hazardAssessment => hazardAssessment.rowFactors)
    hazardAssessment: HazardAssessment;
    @Column({ type: 'enum', enum: MatrixEnum })
    score: MatrixEnum;
    @OneToOne(() => ControlMeasure)
    @JoinColumn()
    controlMeasure: ControlMeasure;
}