import { AppDataSource } from "../../../database/dataSource";
import HazardInventory from "../../../database/entity/HazardInventory";
import { WorkUnit } from "../../../database/entity/WorkUnit";

export const HazardInventoryRepository = AppDataSource.getRepository(HazardInventory).extend({
    findOneById(id: number, organizationId: string) {
        return this.createQueryBuilder("inventory")
            .leftJoinAndMapMany("inventory.workUnits", WorkUnit, "workUnits", "inventory.id = workUnits.inventory")
            .leftJoinAndMapMany("workUnits.roles", "workUnits.roles", "roles")
            .leftJoinAndSelect("workUnits.department", "department")
            .where("inventory.id = :id", { id })
            .andWhere("inventory.organizationId = :organizationId", { organizationId })
            .getOne();
    }
})