"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FactorMapper_1 = __importDefault(require("./FactorMapper"));
const ControlMeasureMapper_1 = __importDefault(require("./ControlMeasureMapper"));
class RowFactorMapper {
    static toDto(entity) {
        var _a;
        if (!entity) {
            throw new Error('RowFactor entity is required');
        }
        return {
            id: entity.id,
            factor: FactorMapper_1.default.toDto(entity.factor),
            intensity: entity.intensity,
            technique: entity.technique,
            source: entity.source,
            exposureTime: entity.exposureTime,
            harm: entity.harm,
            probability: entity.probability,
            severity: entity.severity,
            hazardAssessmentId: (_a = entity.hazardAssessment) === null || _a === void 0 ? void 0 : _a.id,
            score: entity.score,
            controlMeasure: entity.controlMeasure ? ControlMeasureMapper_1.default.toDto(entity.controlMeasure) : undefined,
        };
    }
}
exports.default = RowFactorMapper;
