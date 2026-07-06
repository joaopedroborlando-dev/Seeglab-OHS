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
exports.findAllFactorsByHazardId = exports.updateFactor = exports.createFactor = void 0;
const dataSource_1 = require("../../../database/dataSource");
const Factor_1 = __importDefault(require("../../../database/entity/Factor"));
const Hazard_1 = __importDefault(require("../../../database/entity/Hazard"));
const paginationHelper_1 = require("../../../util/paginationHelper");
const FactorMapper_1 = __importDefault(require("../mapper/FactorMapper"));
const requestContext_1 = require("../../../context/requestContext");
const createFactor = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    const factor = new Factor_1.default();
    const hazard = yield dataSource_1.AppDataSource.manager.findOneBy(Hazard_1.default, { id: dto.hazardId });
    const { organizationId } = (0, requestContext_1.getContext)();
    if (!hazard)
        throw new Error("BAD_SOURCE");
    factor.description = dto.description;
    factor.hazard = hazard;
    factor.organizationId = organizationId;
    return yield dataSource_1.AppDataSource.manager.save(factor);
});
exports.createFactor = createFactor;
const updateFactor = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dto.id || !dto.description)
        throw new Error("INCORRECT_IR_OR_DEPARTMENT");
    const factor = yield dataSource_1.AppDataSource.manager.findOneBy(Factor_1.default, {
        id: dto.id,
    });
    if (!factor)
        throw new Error("FACTOR_NOT_FOUND");
    factor.description = dto.description;
    return yield dataSource_1.AppDataSource.manager.save(factor);
});
exports.updateFactor = updateFactor;
const findAllFactorsByHazardId = (paginationOptions, hazardId) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    const queryBuilder = dataSource_1.AppDataSource.getRepository(Factor_1.default)
        .createQueryBuilder("factor")
        .leftJoinAndSelect("factor.hazard", "hazard")
        .where("hazard.id = :hazardId", { hazardId })
        .andWhere("factor.organizationId= :organizationId", { organizationId });
    if (paginationOptions.search) {
        queryBuilder.andWhere("factor.description LIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("factor.description", "ASC");
    const results = yield (0, paginationHelper_1.getManyPaginated)(paginationOptions, queryBuilder);
    return {
        meta: results.meta,
        data: FactorMapper_1.default.toDtoList(results.data)
    };
});
exports.findAllFactorsByHazardId = findAllFactorsByHazardId;
