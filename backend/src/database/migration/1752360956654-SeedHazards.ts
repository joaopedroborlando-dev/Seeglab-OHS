import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedHazards1752360956654 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Renomeia o antigo ACCIDENT para MECHANIC (preserva o id e os factors vinculados)
        await queryRunner.query(`
            UPDATE hazard
            SET description = 'MECHANIC'
            WHERE description = 'ACCIDENT'
              AND NOT EXISTS (SELECT 1 FROM hazard WHERE description = 'MECHANIC')
        `);

        // Insere os hazards que ainda não existem (idempotente)
        await queryRunner.query(`
            INSERT INTO hazard (description, color)
            SELECT v.description, v.color
            FROM (VALUES
                ('BIOLOGICAL', '#8B5E3C'),
                ('CHEMICAL',   '#B33A3A'),
                ('MECHANIC',   '#4A6FA5'),
                ('PHYSICAL',   '#5A8F5A'),
                ('ERGONOMIC',  '#C9A227')
            ) AS v(description, color)
            WHERE NOT EXISTS (SELECT 1 FROM hazard h WHERE h.description = v.description)
        `);

        // Garante as cores atualizadas nos registros que já existiam
        await queryRunner.query(`
            UPDATE hazard h
            SET color = v.color
            FROM (VALUES
                ('BIOLOGICAL', '#8B5E3C'),
                ('CHEMICAL',   '#B33A3A'),
                ('MECHANIC',   '#4A6FA5'),
                ('PHYSICAL',   '#5A8F5A'),
                ('ERGONOMIC',  '#C9A227')
            ) AS v(description, color)
            WHERE h.description = v.description
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM hazard
            WHERE description IN ('BIOLOGICAL', 'CHEMICAL', 'MECHANIC', 'PHYSICAL', 'ERGONOMIC')
        `);
    }

}
