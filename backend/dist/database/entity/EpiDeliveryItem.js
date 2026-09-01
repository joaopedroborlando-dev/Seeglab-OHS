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
exports.EpiDeliveryItem = exports.DeliveryItemStatusEnum = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const EpiDelivery_1 = require("./EpiDelivery");
const Epi_1 = require("./Epi");
var DeliveryItemStatusEnum;
(function (DeliveryItemStatusEnum) {
    DeliveryItemStatusEnum["ACTIVE"] = "ACTIVE";
    DeliveryItemStatusEnum["RETURNED"] = "RETURNED";
    DeliveryItemStatusEnum["DISCARDED"] = "DISCARDED";
})(DeliveryItemStatusEnum = exports.DeliveryItemStatusEnum || (exports.DeliveryItemStatusEnum = {}));
let EpiDeliveryItem = class EpiDeliveryItem extends BaseModel_1.BaseModel {
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => EpiDelivery_1.EpiDelivery, delivery => delivery.items),
    __metadata("design:type", EpiDelivery_1.EpiDelivery)
], EpiDeliveryItem.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Epi_1.Epi),
    __metadata("design:type", Epi_1.Epi)
], EpiDeliveryItem.prototype, "epi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EpiDeliveryItem.prototype, "caAtDelivery", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], EpiDeliveryItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EpiDeliveryItem.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: DeliveryItemStatusEnum.ACTIVE }),
    __metadata("design:type", String)
], EpiDeliveryItem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], EpiDeliveryItem.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], EpiDeliveryItem.prototype, "returnedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EpiDeliveryItem.prototype, "returnReason", void 0);
EpiDeliveryItem = __decorate([
    (0, typeorm_1.Entity)()
], EpiDeliveryItem);
exports.EpiDeliveryItem = EpiDeliveryItem;
