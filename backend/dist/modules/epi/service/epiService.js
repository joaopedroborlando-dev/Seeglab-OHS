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
exports.deleteEpi = exports.findAllEpis = exports.updateEpi = exports.createEpi = void 0;
const dataSource_1 = require("../../../database/dataSource");
const Epi_1 = require("../../../database/entity/Epi");
const requestContext_1 = require("../../../context/requestContext");
const createEpi = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { organizationId } = (0, requestContext_1.getContext)();
    const epi = new Epi_1.Epi();
    epi.name = dto.name;
    epi.caNumber = (_a = dto.caNumber) !== null && _a !== void 0 ? _a : "";
    epi.caExpiration = (_b = dto.caExpiration) !== null && _b !== void 0 ? _b : new Date();
    epi.manufacturer = (_c = dto.manufacturer) !== null && _c !== void 0 ? _c : "";
    epi.organizationId = organizationId;
    return yield dataSource_1.AppDataSource.manager.save(epi);
});
exports.createEpi = createEpi;
const updateEpi = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    if (!dto.id)
        throw new Error("INCORRECT_DATA");
    const { organizationId } = (0, requestContext_1.getContext)();
    const epi = yield dataSource_1.AppDataSource.manager.findOneBy(Epi_1.Epi, {
        id: dto.id,
        organizationId: organizationId,
    });
    if (!epi)
        throw new Error("EPI_NOT_FOUND");
    epi.name = dto.name;
    epi.caNumber = (_d = dto.caNumber) !== null && _d !== void 0 ? _d : epi.caNumber;
    epi.caExpiration = (_e = dto.caExpiration) !== null && _e !== void 0 ? _e : epi.caExpiration;
    epi.manufacturer = (_f = dto.manufacturer) !== null && _f !== void 0 ? _f : epi.manufacturer;
    return yield dataSource_1.AppDataSource.manager.save(epi);
});
exports.updateEpi = updateEpi;
const findAllEpis = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { filter } = paginationOptions;
    const queryBuilder = dataSource_1.AppDataSource.getRepository(Epi_1.Epi)
        .createQueryBuilder("epi")
        .where("epi.organizationId = :organizationId", { organizationId });
    const { description, expirationStart, expirationEnd } = filter || {};
    if (description) {
        queryBuilder.andWhere("epi.name ILIKE :description", {
            description: `%${description}%`
        }).orWhere("epi.manufacturer ILIKE :description", {
            description: `%${description}%`
        });
    }
    if (expirationStart && expirationEnd) {
        const startDate = new Date(expirationStart);
        const endDate = new Date(expirationEnd);
        queryBuilder.andWhere("epi.caExpiration BETWEEN :startDate AND :endDate", {
            startDate,
            endDate
        });
    }
    else if (expirationStart) {
        const startDate = new Date(expirationStart);
        queryBuilder.andWhere("epi.caExpiration >= :startDate", {
            startDate
        });
    }
    else if (expirationEnd) {
        const endDate = new Date(expirationEnd);
        queryBuilder.andWhere("epi.caExpiration <= :endDate", {
            endDate
        });
    }
    queryBuilder.addOrderBy("epi.name", "ASC");
    const total = yield queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);
    const rawResults = yield queryBuilder.getMany();
    const epis = rawResults.map(epi => ({
        id: epi.id,
        name: epi.name,
        caNumber: epi.caNumber,
        caExpiration: epi.caExpiration,
        manufacturer: epi.manufacturer,
    }));
    const totalPages = Math.ceil(total / limit);
    return {
        data: epis,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
});
exports.findAllEpis = findAllEpis;
const deleteEpi = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    if (!id)
        throw new Error("INCORRECT_DATA");
    const deleteResult = yield dataSource_1.AppDataSource.manager.delete(Epi_1.Epi, { id, organizationId });
    return deleteResult.affected !== 0;
});
exports.deleteEpi = deleteEpi;
