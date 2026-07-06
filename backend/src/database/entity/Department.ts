import { Entity, Column, OneToMany } from "typeorm"
import Role from "./Role";
import { BaseModel } from "./BaseModel";

@Entity()
export default class Department extends BaseModel {

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => Role, (role) => role.department)
    roles: Role[];
}