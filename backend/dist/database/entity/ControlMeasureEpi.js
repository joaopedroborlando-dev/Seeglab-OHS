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
exports.ControlMeasureEpi = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const ControlMeasure_1 = require("./ControlMeasure");
const Epi_1 = require("./Epi");
let ControlMeasureEpi = class ControlMeasureEpi extends BaseModel_1.BaseModel {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => ControlMeasure_1.ControlMeasure, cm => cm.epis),
    __metadata("design:type", ControlMeasure_1.ControlMeasure)
], ControlMeasureEpi.prototype, "controlMeasure", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Epi_1.Epi, epi => epi.controlMeasures),
    __metadata("design:type", Epi_1.Epi)
], ControlMeasureEpi.prototype, "epi", void 0);
ControlMeasureEpi = __decorate([
    (0, typeorm_1.Entity)()
], ControlMeasureEpi);
exports.ControlMeasureEpi = ControlMeasureEpi;
