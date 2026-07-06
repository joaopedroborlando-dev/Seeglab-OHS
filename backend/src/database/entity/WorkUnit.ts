import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import Department from "./Department";
import { HazardAssessment } from "./HazardAssessment";
import HazardInventory from "./HazardInventory";
import Role from "./Role";

@Entity()
export class WorkUnit extends BaseModel {

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    code: string | null;

    @ManyToOne(() => HazardInventory)
    inventory: HazardInventory;

    @ManyToOne(() => Department)
    department: Department;

    @ManyToMany(
        () => Role,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinTable({
        name: 'workUnit_role',
        joinColumn: {
            name: 'workUnit_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles?: Role[];

    @OneToMany(() => HazardAssessment, hazard => hazard.workUnit)
    hazardAssessments: HazardAssessment[];
}