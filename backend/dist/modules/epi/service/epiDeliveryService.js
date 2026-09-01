"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDelivery = exports.getRecommendations = exports.getDeliveryContext = void 0;
const EpiDelivery_1 = require("../../../database/entity/EpiDelivery");
const EpiDeliveryItem_1 = require("../../../database/entity/EpiDeliveryItem");
const epiDeliveryRepository_1 = require("../repository/epiDeliveryRepository");
const getDeliveryContext = (inventoryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield epiDeliveryRepository_1.EpiDeliveryRepository.getDeliveryContext(inventoryId);
});
exports.getDeliveryContext = getDeliveryContext;
const getRecommendations = (workUnitId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield epiDeliveryRepository_1.EpiDeliveryRepository.getRecommendations(workUnitId);
});
exports.getRecommendations = getRecommendations;
const createDelivery = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const delivery = new EpiDelivery_1.EpiDelivery();
    delivery.employee = { id: dto.employeeId };
    if (dto.workUnitId) {
        delivery.workUnit = { id: dto.workUnitId };
    }
    delivery.deliveredAt = dto.deliveredAt;
    if (dto.status)
        delivery.status = dto.status;
    delivery.signatureData = (_a = dto.signatureData) !== null && _a !== void 0 ? _a : null;
    delivery.signedAt = (_b = dto.signedAt) !== null && _b !== void 0 ? _b : null;
    if (dto.createdById) {
        delivery.createdBy = { id: dto.createdById };
    }
    delivery.notes = (_c = dto.notes) !== null && _c !== void 0 ? _c : null;
    delivery.items = dto.items.map(itemDto => {
        var _a, _b, _c, _d;
        if (!itemDto.expiresAt)
            throw new Error("BAD_RESOURCE");
        const item = new EpiDeliveryItem_1.EpiDeliveryItem();
        item.epi = { id: itemDto.epiId };
        item.caAtDelivery = (_a = itemDto.caAtDelivery) !== null && _a !== void 0 ? _a : null;
        item.quantity = itemDto.quantity;
        item.size = (_b = itemDto.size) !== null && _b !== void 0 ? _b : null;
        if (itemDto.status)
            item.status = itemDto.status;
        item.expiresAt = itemDto.expiresAt;
        item.returnedAt = (_c = itemDto.returnedAt) !== null && _c !== void 0 ? _c : null;
        item.returnReason = (_d = itemDto.returnReason) !== null && _d !== void 0 ? _d : null;
        return item;
    });
    const savedDelivery = yield epiDeliveryRepository_1.EpiDeliveryRepository.save(delivery);
    return savedDelivery;
});
exports.createDelivery = createDelivery;
