import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import Role from "./Role";
import { BaseModel } from "./BaseModel";

@Entity()
export default class Employee extends BaseModel {

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date | null;

    @Column({ type: 'text', nullable: true })
    maritalStatus: string | null;

    @Column({ type: 'text', nullable: true })
    CPF: string | null;

    @Column({ type: 'text', nullable: true })
    PIS: string | null;

    @Column({ type: 'text', nullable: true })
    post: string | null;

    @ManyToMany(() => Role, (role) => role.employees)
    @JoinTable()
    roles: Role[];
}
