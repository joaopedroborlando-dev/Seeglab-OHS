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
import { EpiDelivery } from "./entity/EpiDelivery";
import { EpiDeliveryItem } from "./entity/EpiDeliveryItem";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "core",
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
        EpiDelivery,
        EpiDeliveryItem,
    ],
    subscribers: [],
    // Roda as migrations pendentes no initialize() (após o synchronize criar as tabelas)
    migrationsRun: true,
    // __dirname resolve tanto em src/ (ts-node) quanto em dist/ (Docker)
    migrations: [__dirname + "/migration/*{.ts,.js}"],
})