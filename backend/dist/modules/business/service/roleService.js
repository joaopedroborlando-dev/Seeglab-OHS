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
exports.findAllRolesByDepartmentId = exports.findAllRoles = exports.updateRole = exports.createRole = void 0;
const dataSource_1 = require("../../../database/dataSource");
const Department_1 = __importDefault(require("../../../database/entity/Department"));
const Role_1 = __importDefault(require("../../../database/entity/Role"));
const paginationHelper_1 = require("../../../util/paginationHelper");
const requestContext_1 = require("../../../context/requestContext");
const createRole = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const role = new Role_1.default();
    const department = yield dataSource_1.AppDataSource.manager.findOneBy(Department_1.default, {
        id: dto.departmentId,
    });
    if (!department)
        throw new Error("NO_DEPARTMENT_FOUND");
    const { organizationId } = (0, requestContext_1.getContext)();
    role.description = (_a = dto.description) !== null && _a !== void 0 ? _a : "";
    role.name = (_b = dto.name) !== null && _b !== void 0 ? _b : "";
    role.department = department;
    role.organizationId = organizationId;
    return yield dataSource_1.AppDataSource.manager.save(role);
});
exports.createRole = createRole;
const updateRole = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dto.id || !dto.description || !dto.name)
        throw new Error("INVALID_DATA");
    const { organizationId } = (0, requestContext_1.getContext)();
    const role = yield dataSource_1.AppDataSource.manager.findOneBy(Role_1.default, {
        id: dto.id,
        organizationId,
    });
    if (!role)
        throw new Error("DEPARTMENT_NOT_FOUND");
    role.description = dto.description;
    role.name = dto.name;
    if (dto.departmentId) {
        const department = yield dataSource_1.AppDataSource.manager.findOneBy(Department_1.default, {
            id: dto.departmentId,
        });
        if (department)
            role.department = department;
    }
    return yield dataSource_1.AppDataSource.manager.save(role);
});
exports.updateRole = updateRole;
const findAllRoles = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { organizationId } = (0, requestContext_1.getContext)();
    const queryBuilder = dataSource_1.AppDataSource.getRepository(Role_1.default)
        .createQueryBuilder("role")
        .leftJoinAndSelect("role.department", "department")
        .where("role.organizationId = :organizationId", { organizationId });
    if (paginationOptions.search) {
        queryBuilder.andWhere("role.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("role.name", "ASC");
    const total = yield queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);
    const rawResults = yield queryBuilder.getMany();
    const roles = rawResults.map(role => {
        var _a, _b;
        {
            return {
                id: role.id,
                description: role.description,
                departmentId: (_b = (_a = role.department) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                name: role.name,
            };
        }
    });
    const totalPages = Math.ceil(total / limit);
    return {
        data: roles,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
});
exports.findAllRoles = findAllRoles;
const findAllRolesByDepartmentId = (paginationOptions, departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    const queryBuilder = dataSource_1.AppDataSource.getRepository(Role_1.default)
        .createQueryBuilder("role")
        .leftJoinAndSelect("role.department", "department")
        .where("department.id = :departmentId", { departmentId })
        .andWhere("role.organizationId= :organizationId", { organizationId });
    if (paginationOptions.search) {
        queryBuilder.andWhere("role.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("role.name", "ASC");
    const results = yield (0, paginationHelper_1.getManyPaginated)(paginationOptions, queryBuilder);
    return {
        meta: results.meta,
        data: results.data.map((role) => {
            return {
                id: role.id,
                description: role.description,
                name: role.name,
            };
        })
    };
});
exports.findAllRolesByDepartmentId = findAllRolesByDepartmentId;
