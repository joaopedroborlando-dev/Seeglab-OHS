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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRowFactor = exports.createRowFactor = void 0;
const dataSource_1 = require("../../../database/dataSource");
const HazardAssessment_1 = require("../../../database/entity/HazardAssessment");
const Factor_1 = __importDefault(require("../../../database/entity/Factor"));
const RowFactor_1 = require("../../../database/entity/RowFactor");
const RowFactorMapper_1 = __importDefault(require("../mapper/RowFactorMapper"));
const hazardService_1 = require("./hazardService");
const requestContext_1 = require("../../../context/requestContext");
const riskScore = (probability, severity) => {
    const score = probability * severity;
    if (score > 12)
        return RowFactor_1.MatrixEnum.VERY_HIGH;
    else if (score <= 12 && score >= 8)
        return RowFactor_1.MatrixEnum.HIGH;
    else if (score < 8 && score > 3)
        return RowFactor_1.MatrixEnum.MODERATE;
    else
        return RowFactor_1.MatrixEnum.LOW;
};
const createRowFactor = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { organizationId } = (0, requestContext_1.getContext)();
    if (!data || !data.hazardAssessmentId)
        throw new Error("INCORRECT_DATA");
    const hazardAssessment = yield dataSource_1.AppDataSource.manager.findOneBy(HazardAssessment_1.HazardAssessment, { id: data.hazardAssessmentId });
    if (!hazardAssessment)
        throw new Error("INCORRECT_DATA");
    let factor;
    if (data.factor && !data.factor.id) {
        factor = new Factor_1.default();
        factor.description = data.factor.description;
        const hazard = yield (0, hazardService_1.findHazardById)((_a = data.hazardId) !== null && _a !== void 0 ? _a : -1);
        if (!hazard)
            throw new Error("INCORRECT_DATA");
        factor.hazard = hazard;
        factor.organizationId = organizationId;
        yield dataSource_1.AppDataSource.manager.save(Factor_1.default, factor);
    }
    else {
        factor = yield dataSource_1.AppDataSource.manager.findOneBy(Factor_1.default, { id: data.factor.id });
        if (!factor)
            throw new Error("INCORRECT_DATA");
        factor.description = data.factor.description;
        yield dataSource_1.AppDataSource.manager.save(Factor_1.default, factor);
    }
    const rowFactor = new RowFactor_1.RowFactor();
    if (data.id) {
        rowFactor.id = data.id;
    }
    rowFactor.factor = factor;
    rowFactor.hazardAssessment = hazardAssessment;
    rowFactor.exposureTime = data.exposureTime;
    rowFactor.harm = data.harm;
    rowFactor.intensity = data.intensity;
    rowFactor.probability = data.probability;
    rowFactor.severity = data.severity;
    rowFactor.technique = data.technique;
    rowFactor.score = riskScore(data.probability, data.severity);
    rowFactor.organizationId = organizationId;
    rowFactor.source = data.source;
    return RowFactorMapper_1.default.toDto(yield dataSource_1.AppDataSource.manager.save(RowFactor_1.RowFactor, rowFactor));
});
exports.createRowFactor = createRowFactor;
const deleteRowFactor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    const deleted = yield dataSource_1.AppDataSource.manager.delete(RowFactor_1.RowFactor, { id, organizationId });
    if (deleted.affected && deleted.affected > 0)
        return true;
    return false;
});
exports.deleteRowFactor = deleteRowFactor;
