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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const WorkUnit_1 = require("./WorkUnit");
let HazardInventory = class HazardInventory extends BaseModel_1.BaseModel {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], HazardInventory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HazardInventory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => WorkUnit_1.WorkUnit, unit => unit.inventory),
    __metadata("design:type", Array)
], HazardInventory.prototype, "workUnits", void 0);
HazardInventory = __decorate([
    (0, typeorm_1.Entity)()
], HazardInventory);
exports.default = HazardInventory;
