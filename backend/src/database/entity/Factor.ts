import {Entity, Column, ManyToOne} from "typeorm"
import Hazard from "./Hazard";
import {BaseModel} from "./BaseModel";

@Entity()
export default class Factor extends BaseModel{

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => Hazard, (hazard) => hazard.factors)
    hazard: Hazard;
}