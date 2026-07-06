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
exports.findRelatedWorkUnits = exports.findLastUpdatedWorkUnit = exports.deleteById = exports.updateWorkUnit = exports.createWorkUnit = exports.findManyByInventoryId = void 0;
const dataSource_1 = require("../../../database/dataSource");
const HazardInventory_1 = __importDefault(require("../../../database/entity/HazardInventory"));
const Department_1 = __importDefault(require("../../../database/entity/Department"));
const Role_1 = __importDefault(require("../../../database/entity/Role"));
const WorkUnit_1 = require("../../../database/entity/WorkUnit");
const typeorm_1 = require("typeorm");
const WorkUnitMapper_1 = require("../mapper/WorkUnitMapper");
const requestContext_1 = require("../../../context/requestContext");
const workUnitRepository_1 = require("../repository/workUnitRepository");
const findManyByInventoryId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Incorrect data");
    const workUnits = yield workUnitRepository_1.WorkUnitRepository.findByInventoryId(id);
    return WorkUnitMapper_1.WorkUnitMapper.toDtoList(workUnits);
});
exports.findManyByInventoryId = findManyByInventoryId;
const createWorkUnit = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { organizationId } = (0, requestContext_1.getContext)();
    const [inventory, department] = yield Promise.all([
        dataSource_1.AppDataSource.manager.findOneBy(HazardInventory_1.default, { id: dto.inventoryId }),
        dataSource_1.AppDataSource.manager.findOneBy(Department_1.default, { id: dto.departmentId }),
    ]);
    if (!inventory || !department)
        throw new Error("BAD_RESOURCE");
    if (!dto.name)
        throw new Error("BAD_RESOURCE");
    const roles = yield dataSource_1.AppDataSource.getRepository(Role_1.default).findBy({
        id: (0, typeorm_1.In)((_b = (_a = dto.roles) === null || _a === void 0 ? void 0 : _a.map((r) => r.id)) !== null && _b !== void 0 ? _b : []),
    });
    const workUnit = Object.assign(new WorkUnit_1.WorkUnit(), {
        department,
        inventory,
        roles,
        organizationId,
        name: dto.name,
        code: (_c = dto.code) !== null && _c !== void 0 ? _c : null,
    });
    const saved = yield dataSource_1.AppDataSource.manager.save(workUnit);
    return WorkUnitMapper_1.WorkUnitMapper.toDto(saved);
});
exports.createWorkUnit = createWorkUnit;
const updateWorkUnit = (id, dto) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const workUnit = yield workUnitRepository_1.WorkUnitRepository.findByIdWithRoles(id);
    if (!workUnit)
        throw new Error("NOT_FOUND");
    if (dto.name !== undefined)
        workUnit.name = dto.name;
    if (dto.code !== undefined)
        workUnit.code = (_d = dto.code) !== null && _d !== void 0 ? _d : null;
    if (dto.roles !== undefined) {
        workUnit.roles = yield dataSource_1.AppDataSource.getRepository(Role_1.default).findBy({
            id: (0, typeorm_1.In)(dto.roles.map((r) => r.id)),
        });
    }
    if (dto.departmentId !== undefined) {
        const department = yield dataSource_1.AppDataSource.manager.findOneBy(Department_1.default, { id: dto.departmentId });
        if (!department)
            throw new Error("BAD_RESOURCE");
        workUnit.department = department;
    }
    const saved = yield dataSource_1.AppDataSource.manager.save(workUnit);
    return WorkUnitMapper_1.WorkUnitMapper.toDtoList([saved])[0];
});
exports.updateWorkUnit = updateWorkUnit;
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Incorrect data");
    const workUnit = yield workUnitRepository_1.WorkUnitRepository.findByIdWithRoles(id);
    if (!workUnit)
        throw new Error("NOT_FOUND");
    workUnit.roles = [];
    yield workUnitRepository_1.WorkUnitRepository.save(workUnit);
    yield workUnitRepository_1.WorkUnitRepository.remove(workUnit);
    return true;
});
exports.deleteById = deleteById;
const findLastUpdatedWorkUnit = () => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    const lastUnit = yield workUnitRepository_1.WorkUnitRepository.findLastUpdatedInventoryId();
    if (!lastUnit)
        return [];
    const workUnits = yield workUnitRepository_1.WorkUnitRepository.findByInventoryIdWithAssessments(lastUnit.inventory.id, organizationId);
    return WorkUnitMapper_1.WorkUnitMapper.toDtoList(workUnits);
});
exports.findLastUpdatedWorkUnit = findLastUpdatedWorkUnit;
const findRelatedWorkUnits = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const workUnit = yield workUnitRepository_1.WorkUnitRepository.findOne({
        where: { id },
        relations: ["inventory"],
    });
    if (!workUnit)
        return [];
    const related = yield workUnitRepository_1.WorkUnitRepository.findRelatedByInventoryId(workUnit.inventory.id, id);
    return WorkUnitMapper_1.WorkUnitMapper.toDtoList(related);
});
exports.findRelatedWorkUnits = findRelatedWorkUnits;
