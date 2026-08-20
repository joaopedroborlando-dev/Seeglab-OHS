import { Entity, Column, ManyToOne, ManyToMany } from "typeorm"
import Department from "./Department";
import Employee from "./Employee";
import { BaseModel } from "./BaseModel";

@Entity()
export default class Role extends BaseModel {

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => Department, (department) => department.roles)
    department: Department;

    @ManyToMany(() => Employee, (employee) => employee.roles)
    employees: Employee[];
}