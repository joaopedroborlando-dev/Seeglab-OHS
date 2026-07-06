"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HazardInventoryRepository = void 0;
const dataSource_1 = require("../../../database/dataSource");
const HazardInventory_1 = __importDefault(require("../../../database/entity/HazardInventory"));
const WorkUnit_1 = require("../../../database/entity/WorkUnit");
exports.HazardInventoryRepository = dataSource_1.AppDataSource.getRepository(HazardInventory_1.default).extend({
    findOneById(id, organizationId) {
        return this.createQueryBuilder("inventory")
            .leftJoinAndMapMany("inventory.workUnits", WorkUnit_1.WorkUnit, "workUnits", "inventory.id = workUnits.inventory")
            .leftJoinAndMapMany("workUnits.roles", "workUnits.roles", "roles")
            .leftJoinAndSelect("workUnits.department", "department")
            .where("inventory.id = :id", { id })
            .andWhere("inventory.organizationId = :organizationId", { organizationId })
            .getOne();
    }
});
