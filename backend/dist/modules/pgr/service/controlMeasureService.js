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
exports.deleteControlMeasure = exports.createControlMeasure = void 0;
const requestContext_1 = require("../../../context/requestContext");
const dataSource_1 = require("../../../database/dataSource");
const RowFactor_1 = require("../../../database/entity/RowFactor");
const ControlMeasure_1 = require("../../../database/entity/ControlMeasure");
const ControlMeasureMapper_1 = __importDefault(require("../mapper/ControlMeasureMapper"));
const Epi_1 = require("../../../database/entity/Epi");
const ControlMeasureEpi_1 = require("../../../database/entity/ControlMeasureEpi");
const createControlMeasure = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { organizationId } = (0, requestContext_1.getContext)();
    if (!data || !data.rowFactorId)
        throw new Error("INCORRECT_DATA");
    const rowFactor = yield dataSource_1.AppDataSource.manager.findOneBy(RowFactor_1.RowFactor, { id: data.rowFactorId });
    if (!rowFactor)
        throw new Error("INCORRECT_DATA");
    const controlMeasure = dataSource_1.AppDataSource.manager.create(ControlMeasure_1.ControlMeasure, Object.assign({ administrativeMeasure: (_a = data.administrativeMeasure) !== null && _a !== void 0 ? _a : "", epc: (_b = data.epc) !== null && _b !== void 0 ? _b : "", organizationId: organizationId }, (data.id && { id: data.id })));
    // Delete all EPIs relations
    if (data.id) {
        yield dataSource_1.AppDataSource.manager.delete(ControlMeasureEpi_1.ControlMeasureEpi, { controlMeasure: { id: data.id } });
    }
    // Map EPIs
    if (data.epis && data.epis.length > 0) {
        const epiRepository = dataSource_1.AppDataSource.getRepository(Epi_1.Epi);
        const epiEntities = [];
        for (const epiId of data.epis) {
            const epi = yield epiRepository.findOne({ where: { id: Number(epiId), organizationId } });
            if (epi) {
                epiEntities.push(dataSource_1.AppDataSource.manager.create(ControlMeasureEpi_1.ControlMeasureEpi, {
                    controlMeasure: controlMeasure,
                    epi: epi,
                    organizationId: organizationId,
                }));
            }
            else {
                throw new Error(`EPI with ID ${epiId} not found`);
            }
        }
        yield dataSource_1.AppDataSource.manager.save(epiEntities);
        controlMeasure.epis = epiEntities;
    }
    yield dataSource_1.AppDataSource.manager.save(controlMeasure);
    rowFactor.controlMeasure = controlMeasure;
    yield dataSource_1.AppDataSource.manager.save(rowFactor);
    return ControlMeasureMapper_1.default.toDto(controlMeasure);
});
exports.createControlMeasure = createControlMeasure;
const deleteControlMeasure = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("INCORRECT_DATA");
    const rowFactor = yield dataSource_1.AppDataSource.manager.findOne(RowFactor_1.RowFactor, {
        where: { controlMeasure: { id } },
        relations: ['controlMeasure']
    });
    if (rowFactor) {
        rowFactor.controlMeasure = null;
        yield dataSource_1.AppDataSource.manager.save(rowFactor);
    }
    yield dataSource_1.AppDataSource.manager.delete(ControlMeasureEpi_1.ControlMeasureEpi, { controlMeasure: { id } });
    const deleteResult = yield dataSource_1.AppDataSource.manager.delete(ControlMeasure_1.ControlMeasure, { id });
    return deleteResult.affected !== 0;
});
exports.deleteControlMeasure = deleteControlMeasure;
