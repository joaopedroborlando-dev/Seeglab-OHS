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
exports.RowFactor = exports.MatrixEnum = exports.ExposureTimeEnum = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Factor_1 = __importDefault(require("./Factor"));
const HazardAssessment_1 = require("./HazardAssessment");
const ControlMeasure_1 = require("./ControlMeasure");
var ExposureTimeEnum;
(function (ExposureTimeEnum) {
    ExposureTimeEnum[ExposureTimeEnum["INTERMITTENT"] = 1] = "INTERMITTENT";
    ExposureTimeEnum[ExposureTimeEnum["OCCASIONAL"] = 2] = "OCCASIONAL";
    ExposureTimeEnum[ExposureTimeEnum["PERMANENT"] = 3] = "PERMANENT";
})(ExposureTimeEnum = exports.ExposureTimeEnum || (exports.ExposureTimeEnum = {}));
var MatrixEnum;
(function (MatrixEnum) {
    MatrixEnum[MatrixEnum["VERY_LOW"] = 1] = "VERY_LOW";
    MatrixEnum[MatrixEnum["LOW"] = 2] = "LOW";
    MatrixEnum[MatrixEnum["MODERATE"] = 3] = "MODERATE";
    MatrixEnum[MatrixEnum["HIGH"] = 4] = "HIGH";
    MatrixEnum[MatrixEnum["VERY_HIGH"] = 5] = "VERY_HIGH";
})(MatrixEnum = exports.MatrixEnum || (exports.MatrixEnum = {}));
let RowFactor = class RowFactor extends BaseModel_1.BaseModel {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Factor_1.default),
    __metadata("design:type", Factor_1.default)
], RowFactor.prototype, "factor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], RowFactor.prototype, "intensity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], RowFactor.prototype, "technique", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], RowFactor.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ExposureTimeEnum }),
    __metadata("design:type", Number)
], RowFactor.prototype, "exposureTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], RowFactor.prototype, "harm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MatrixEnum }),
    __metadata("design:type", Number)
], RowFactor.prototype, "probability", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MatrixEnum }),
    __metadata("design:type", Number)
], RowFactor.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HazardAssessment_1.HazardAssessment, hazardAssessment => hazardAssessment.rowFactors),
    __metadata("design:type", HazardAssessment_1.HazardAssessment)
], RowFactor.prototype, "hazardAssessment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MatrixEnum }),
    __metadata("design:type", Number)
], RowFactor.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ControlMeasure_1.ControlMeasure),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", ControlMeasure_1.ControlMeasure)
], RowFactor.prototype, "controlMeasure", void 0);
RowFactor = __decorate([
    (0, typeorm_1.Entity)()
], RowFactor);
exports.RowFactor = RowFactor;
