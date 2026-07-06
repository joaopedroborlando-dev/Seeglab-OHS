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
exports.findById = exports.createHazardAssessment = void 0;
const HazardAssessment_1 = require("../../../database/entity/HazardAssessment");
const dataSource_1 = require("../../../database/dataSource");
const WorkUnit_1 = require("../../../database/entity/WorkUnit");
const Hazard_1 = __importDefault(require("../../../database/entity/Hazard"));
const HazardAssessmentMapper_1 = require("../mapper/HazardAssessmentMapper");
const requestContext_1 = require("../../../context/requestContext");
const createHazardAssessment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data)
        throw new Error("INCORRECT_DATA");
    const workUnit = yield dataSource_1.AppDataSource.manager.findOneBy(WorkUnit_1.WorkUnit, { id: data.workUnitId });
    if (!workUnit)
        throw new Error("INCORRECT_DATA");
    const hazard = yield dataSource_1.AppDataSource.manager.findOneBy(Hazard_1.default, { id: data.hazard.id });
    if (!hazard)
        throw new Error("INCORRECT_DATA");
    const { organizationId } = (0, requestContext_1.getContext)();
    const assessment = new HazardAssessment_1.HazardAssessment();
    assessment.rowFactors = [];
    assessment.workUnit = workUnit;
    assessment.hazard = hazard;
    assessment.organizationId = organizationId;
    return yield dataSource_1.AppDataSource.manager.save(assessment);
});
exports.createHazardAssessment = createHazardAssessment;
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("INCORRECT_DATA");
    const { organizationId } = (0, requestContext_1.getContext)();
    const assessment = yield dataSource_1.AppDataSource.getRepository(HazardAssessment_1.HazardAssessment)
        .createQueryBuilder("assessment")
        .leftJoinAndSelect("assessment.hazard", "hazard")
        .leftJoinAndMapMany("assessment.rowFactors", "assessment.rowFactors", "rowFactors")
        .leftJoinAndSelect("rowFactors.factor", "factor")
        .where("assessment.id = :id", { id })
        .andWhere("assessment.organizationId = :organizationId", { organizationId: organizationId })
        .getOne();
    if (!assessment)
        throw new Error("INCORRECT_DATA");
    return HazardAssessmentMapper_1.HazardAssessmentMapper.toDto(assessment);
});
exports.findById = findById;
