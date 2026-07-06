"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EpiMapper_1 = __importDefault(require("../../epi/mapper/EpiMapper"));
class ControlMeasureMapper {
    static toDto(entity) {
        if (!entity) {
            throw new Error('ENTITY_IS_REQUIRED');
        }
        return {
            id: entity.id,
            epc: entity.epc,
            epis: EpiMapper_1.default.toDtoList(entity.epis),
            administrativeMeasure: entity.administrativeMeasure
        };
    }
}
exports.default = ControlMeasureMapper;
