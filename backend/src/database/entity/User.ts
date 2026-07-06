import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate
} from "typeorm";
import Organization from "./Organization";
import bcrypt from "bcrypt";

@Entity()
export default class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text' })
    password?: string;

    @Column({ type: 'text', nullable: true })
    phone: string;

    @Column({ type: 'text', nullable: true })
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Organization, (organization) => organization.users)
    organization: Organization;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        if (!this.password) return false;
        return bcrypt.compare(candidatePassword, this.password);
    }
}
