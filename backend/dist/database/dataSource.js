"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Hazard_1 = __importDefault(require("./entity/Hazard"));
const Factor_1 = __importDefault(require("./entity/Factor"));
const Department_1 = __importDefault(require("./entity/Department"));
const Role_1 = __importDefault(require("./entity/Role"));
const HazardInventory_1 = __importDefault(require("./entity/HazardInventory"));
const User_1 = __importDefault(require("./entity/User"));
const Organization_1 = __importDefault(require("./entity/Organization"));
const WorkUnit_1 = require("./entity/WorkUnit");
const RowFactor_1 = require("./entity/RowFactor");
const HazardAssessment_1 = require("./entity/HazardAssessment");
const ControlMeasure_1 = require("./entity/ControlMeasure");
const Epi_1 = require("./entity/Epi");
const ControlMeasureEpi_1 = require("./entity/ControlMeasureEpi");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "core",
    synchronize: true,
    logging: false,
    entities: [
        Hazard_1.default,
        Factor_1.default,
        Department_1.default,
        Role_1.default,
        User_1.default,
        Organization_1.default,
        HazardInventory_1.default,
        WorkUnit_1.WorkUnit,
        HazardInventory_1.default,
        RowFactor_1.RowFactor,
        HazardAssessment_1.HazardAssessment,
        ControlMeasure_1.ControlMeasure,
        Epi_1.Epi,
        ControlMeasureEpi_1.ControlMeasureEpi,
    ],
    subscribers: [],
    migrations: ["src/database/migration/*{.ts,.js}"],
});
