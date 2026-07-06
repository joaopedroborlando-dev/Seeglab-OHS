import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedHazards1752360956654 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO hazard (description, color, "createdAt", "updatedAt")
            VALUES
                ('PHYSICAL', '#ea9999', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW())),
                ('CHEMICAL', '#ea9999', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW())),
                ('BIOLOGICAL', '#aa9d8a', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW())),
                ('ERGONOMIC', '#ffe599', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW())),
                ('ACCIDENT', '#9fc5e8', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW()))
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
