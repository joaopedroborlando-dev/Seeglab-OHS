import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import User from "./User";

@Entity()
export default class Organization {

    @PrimaryColumn({ type: 'text' })
    organizationId: string;

    @Column({ type: 'text' ,nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'text', nullable: true })
    zipcode: string;

    @OneToMany(() => User, (user) => user.organization)
    users: User[];
}