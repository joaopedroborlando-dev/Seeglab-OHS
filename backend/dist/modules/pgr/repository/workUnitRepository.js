"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkUnitRepository = void 0;
const dataSource_1 = require("../../../database/dataSource");
const WorkUnit_1 = require("../../../database/entity/WorkUnit");
exports.WorkUnitRepository = dataSource_1.AppDataSource.getRepository(WorkUnit_1.WorkUnit).extend({
    findByInventoryId(inventoryId) {
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
    findByInventoryIdWithAssessments(inventoryId, organizationId) {
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
    findRelatedByInventoryId(inventoryId, targetId) {
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
    findByIdWithRoles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ where: { id }, relations: ["roles"] });
        });
    },
});
