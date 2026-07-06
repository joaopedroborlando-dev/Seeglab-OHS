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
exports.findHazardById = exports.findAllHazards = exports.updateHazard = exports.createHazard = void 0;
const dataSource_1 = require("../../../database/dataSource");
const Hazard_1 = __importDefault(require("../../../database/entity/Hazard"));
const HazardMapper_1 = __importDefault(require("../../business/mapper/HazardMapper"));
const createHazard = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    const hazard = new Hazard_1.default();
    hazard.description = dto.description;
    return yield dataSource_1.AppDataSource.manager.save(hazard);
});
exports.createHazard = createHazard;
const updateHazard = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dto.id || !dto.description)
        throw new Error("INCORRECT_ID_OR_DESCRIPTION");
    const hazard = yield dataSource_1.AppDataSource.manager.findOneBy(Hazard_1.default, {
        id: dto.id,
    });
    if (hazard == null || undefined)
        throw new Error("HAZARD_NOT_FOUND");
    hazard.description = dto.description;
    return yield dataSource_1.AppDataSource.manager.save(hazard);
});
exports.updateHazard = updateHazard;
const findAllHazards = () => __awaiter(void 0, void 0, void 0, function* () {
    const hazards = yield dataSource_1.AppDataSource.manager.find(Hazard_1.default);
    if (hazards == null || undefined)
        throw new Error("HAZARD_NOT_FOUND");
    return HazardMapper_1.default.toDtoList(hazards);
});
exports.findAllHazards = findAllHazards;
const findHazardById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield dataSource_1.AppDataSource.manager.findOneBy(Hazard_1.default, { id: id });
});
exports.findHazardById = findHazardById;
