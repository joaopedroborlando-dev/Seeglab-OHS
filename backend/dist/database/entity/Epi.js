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
exports.Epi = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const ControlMeasureEpi_1 = require("./ControlMeasureEpi");
let Epi = class Epi extends BaseModel_1.BaseModel {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Epi.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Epi.prototype, "caNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Epi.prototype, "caExpiration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Epi.prototype, "manufacturer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ControlMeasureEpi_1.ControlMeasureEpi, cme => cme.epi),
    __metadata("design:type", Array)
], Epi.prototype, "controlMeasures", void 0);
Epi = __decorate([
    (0, typeorm_1.Entity)()
], Epi);
exports.Epi = Epi;
