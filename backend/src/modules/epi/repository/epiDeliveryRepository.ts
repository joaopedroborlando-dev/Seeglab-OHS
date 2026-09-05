import { AppDataSource } from "../../../database/dataSource";
import { EpiDelivery } from "../../../database/entity/EpiDelivery";

export const EpiDeliveryRepository = AppDataSource.getRepository(EpiDelivery).extend({
    async getDeliveryContext(inventoryId: number) {
        const query = `
        select distinct 
            e.id as "employeeId",
            e.name as "employeeName"
        from work_unit w
        inner join "workUnit_role" wr on wr."workUnit_id" = w.id
        inner join "role" r on r.id = wr.role_id
        inner join "employee_roles_role" er on er."roleId" = r.id
        inner join "employee" e on e.id = er."employeeId"
        where w."inventoryId" = $1;
    `;
        const result = await AppDataSource.query(query, [inventoryId]);
        return result;
    },

    async getWorkUnitByEmployeeId(employeeId: number) {
        const query = `
        select 
            work_unit.id as "workUnitId",
            work_unit.name as "workUnitName"
        from work_unit
        inner join "workUnit_role" wr on wr."workUnit_id" = work_unit.id
        inner join "role" r on r.id = wr.role_id
        inner join "employee_roles_role" er on er."roleId" = r.id
        inner join "employee" e on e.id = er."employeeId"
        where e.id = $1;
    `;
        const result = await AppDataSource.query(query, [employeeId]);
        return result;
    },

    async getRecommendations(workUnitId: number) {
        const query = `
        select
            e.id as "epiId",
            e.name as "epiName",
            e."caNumber" as "caNumber"
        from work_unit w
        inner join hazard_assessment h on h."workUnitId" = w.id
        inner join row_factor rf on rf."hazardAssessmentId" = h.id
        inner join control_measure cm on cm.id = rf."controlMeasureId"
        inner join control_measure_epi cme on cme."controlMeasureId" = cm.id
        inner join epi e on e.id = cme."epiId"
        where w.id = $1;
    `;
        const result = await AppDataSource.query(query, [workUnitId]);
        return result;
    }
})