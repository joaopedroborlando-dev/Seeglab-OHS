import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import Factor from "./Factor";

@Entity()
export default class Hazard {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => Factor, (factor) => factor.hazard)
    factors: Factor[];

    @Column({ type: 'text', nullable: true })
    color: string;
}