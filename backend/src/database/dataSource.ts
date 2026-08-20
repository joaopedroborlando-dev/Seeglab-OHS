import { DataSource } from "typeorm";
import Hazard from "./entity/Hazard"
import Factor from "./entity/Factor";
import Department from "./entity/Department";
import Role from "./entity/Role";
import HazardInventory from "./entity/HazardInventory";
import User from "./entity/User";
import Organization from "./entity/Organization";
import { WorkUnit } from "./entity/WorkUnit";
import { RowFactor } from "./entity/RowFactor";
import { HazardAssessment } from "./entity/HazardAssessment";
import { ControlMeasure } from "./entity/ControlMeasure";
import { Epi } from "./entity/Epi";
import { ControlMeasureEpi } from "./entity/ControlMeasureEpi";
import Employee from "./entity/Employee";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "core",
    synchronize: true,
    logging: false,
    entities: [
        Hazard,
        Factor,
        Department,
        Role,
        User,
        Organization,
        HazardInventory,
        WorkUnit,
        HazardInventory,
        RowFactor,
        HazardAssessment,
        ControlMeasure,
        Epi,
        ControlMeasureEpi,
        Employee,
    ],
    subscribers: [],
    migrations: ["src/database/migration/*{.ts,.js}"],
})