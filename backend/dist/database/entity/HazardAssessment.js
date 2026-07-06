"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HazardAssessment = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Hazard_1 = __importDefault(require("./Hazard"));
const RowFactor_1 = require("./RowFactor");
const WorkUnit_1 = require("./WorkUnit");
let HazardAssessment = class HazardAssessment extends BaseModel_1.BaseModel {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Hazard_1.default),
    __metadata("design:type", Hazard_1.default)
], HazardAssessment.prototype, "hazard", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RowFactor_1.RowFactor, rowFactor => rowFactor.hazardAssessment),
    __metadata("design:type", Array)
], HazardAssessment.prototype, "rowFactors", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => WorkUnit_1.WorkUnit, workUnit => workUnit.hazardAssessments),
    __metadata("design:type", WorkUnit_1.WorkUnit)
], HazardAssessment.prototype, "workUnit", void 0);
HazardAssessment = __decorate([
    (0, typeorm_1.Entity)()
], HazardAssessment);
exports.HazardAssessment = HazardAssessment;
