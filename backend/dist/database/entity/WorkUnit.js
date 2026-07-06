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
exports.WorkUnit = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Department_1 = __importDefault(require("./Department"));
const HazardAssessment_1 = require("./HazardAssessment");
const HazardInventory_1 = __importDefault(require("./HazardInventory"));
const Role_1 = __importDefault(require("./Role"));
let WorkUnit = class WorkUnit extends BaseModel_1.BaseModel {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WorkUnit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], WorkUnit.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HazardInventory_1.default),
    __metadata("design:type", HazardInventory_1.default)
], WorkUnit.prototype, "inventory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_1.default),
    __metadata("design:type", Department_1.default)
], WorkUnit.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Role_1.default, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }),
    (0, typeorm_1.JoinTable)({
        name: 'workUnit_role',
        joinColumn: {
            name: 'workUnit_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], WorkUnit.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HazardAssessment_1.HazardAssessment, hazard => hazard.workUnit),
    __metadata("design:type", Array)
], WorkUnit.prototype, "hazardAssessments", void 0);
WorkUnit = __decorate([
    (0, typeorm_1.Entity)()
], WorkUnit);
exports.WorkUnit = WorkUnit;
