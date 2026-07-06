"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HazardAssessmentMapper = void 0;
const HazardMapper_1 = __importDefault(require("../../business/mapper/HazardMapper"));
const RowFactorMapper_1 = __importDefault(require("./RowFactorMapper"));
class HazardAssessmentMapper {
    static toDto(entity) {
        var _a;
        if (!entity) {
            throw new Error('WorkUnit entity is required');
        }
        return {
            id: entity.id,
            hazard: HazardMapper_1.default.toDto(entity.hazard),
            rows: ((_a = entity.rowFactors) === null || _a === void 0 ? void 0 : _a.map(row => RowFactorMapper_1.default.toDto(row))) || [],
        };
    }
}
exports.HazardAssessmentMapper = HazardAssessmentMapper;
