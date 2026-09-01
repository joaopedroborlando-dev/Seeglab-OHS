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
exports.EpiDelivery = exports.DeliveryStatusEnum = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Employee_1 = __importDefault(require("./Employee"));
const WorkUnit_1 = require("./WorkUnit");
const User_1 = __importDefault(require("./User"));
const EpiDeliveryItem_1 = require("./EpiDeliveryItem");
var DeliveryStatusEnum;
(function (DeliveryStatusEnum) {
    DeliveryStatusEnum["PENDING"] = "PENDING";
    DeliveryStatusEnum["SIGNED"] = "SIGNED";
    DeliveryStatusEnum["CANCELLED"] = "CANCELLED";
})(DeliveryStatusEnum = exports.DeliveryStatusEnum || (exports.DeliveryStatusEnum = {}));
let EpiDelivery = class EpiDelivery extends BaseModel_1.BaseModel {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_1.default),
    __metadata("design:type", Employee_1.default)
], EpiDelivery.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => WorkUnit_1.WorkUnit, { nullable: true }),
    __metadata("design:type", WorkUnit_1.WorkUnit)
], EpiDelivery.prototype, "workUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], EpiDelivery.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: DeliveryStatusEnum.PENDING }),
    __metadata("design:type", String)
], EpiDelivery.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EpiDelivery.prototype, "signatureData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EpiDelivery.prototype, "signedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default),
    __metadata("design:type", User_1.default)
], EpiDelivery.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EpiDelivery.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EpiDeliveryItem_1.EpiDeliveryItem, item => item.delivery, { cascade: true }),
    __metadata("design:type", Array)
], EpiDelivery.prototype, "items", void 0);
EpiDelivery = __decorate([
    (0, typeorm_1.Entity)()
], EpiDelivery);
exports.EpiDelivery = EpiDelivery;
