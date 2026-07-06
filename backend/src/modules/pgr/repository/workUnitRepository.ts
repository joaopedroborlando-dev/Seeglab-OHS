import { AppDataSource } from "../../../database/dataSource";
import { WorkUnit } from "../../../database/entity/WorkUnit";

export const WorkUnitRepository = AppDataSource.getRepository(WorkUnit).extend({

    findByInventoryId(inventoryId: number) {
        return this.createQueryBuilder("unit")
            .leftJoinAndSelect("unit.inventory", "inventory")
            .leftJoinAndSelect("unit.department", "department")
            .leftJoinAndMapMany("unit.roles", "unit.roles", "roles")
            .where("inventory.id = :inventoryId", { inventoryId })
            .getMany();
    },

    findLastUpdatedInventoryId() {
        return this.createQueryBuilder("unit")
            .leftJoinAndSelect("unit.inventory", "inventory")
            .orderBy("unit.updatedAt", "DESC")
            .limit(1)
            .getOne();
    },

    findByInventoryIdWithAssessments(inventoryId: number, organizationId: string) {
        return this.createQueryBuilder("unit")
            .leftJoinAndSelect("unit.inventory", "inventory")
            .leftJoinAndSelect("unit.department", "department")
            .leftJoinAndMapMany("unit.roles", "unit.roles", "roles")
            .leftJoinAndSelect("unit.hazardAssessments", "assessments")
            .leftJoinAndSelect("assessments.hazard", "hazard")
            .leftJoinAndSelect("assessments.rowFactors", "rowFactors")
            .leftJoinAndSelect("rowFactors.factor", "factor")
            .leftJoinAndMapOne("rowFactors.controlMeasure", "rowFactors.controlMeasure", "controlMeasure")
            .where("inventory.id = :inventoryId", { inventoryId })
            .andWhere("inventory.organizationId = :organizationId", { organizationId })
            .orderBy("unit.updatedAt", "DESC")
            .addOrderBy("assessments.updatedAt", "DESC")
            .getMany();
    },

    findRelatedByInventoryId(inventoryId: number, targetId: number) {
        return this.createQueryBuilder("unit")
            .leftJoinAndSelect("unit.inventory", "inventory")
            .leftJoinAndSelect("unit.department", "department")
            .leftJoinAndMapMany("unit.roles", "unit.roles", "roles")
            .leftJoinAndSelect("unit.hazardAssessments", "assessments")
            .leftJoinAndSelect("assessments.hazard", "hazard")
            .leftJoinAndSelect("assessments.rowFactors", "rowFactors")
            .leftJoinAndSelect("rowFactors.factor", "factor")
            .where("inventory.id = :inventoryId", { inventoryId })
            .orderBy("unit.id = :targetId", "DESC")
            .addOrderBy("unit.updatedAt", "DESC")
            .addOrderBy("assessments.updatedAt", "DESC")
            .setParameter("targetId", targetId)
            .getMany();
    },

    async findByIdWithRoles(id: number) {
        return this.findOne({ where: { id }, relations: ["roles"] });
    },

});