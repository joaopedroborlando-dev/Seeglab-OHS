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
exports.findAllDepartments = exports.updateDepartment = exports.createDepartment = void 0;
const dataSource_1 = require("../../../database/dataSource");
const Department_1 = __importDefault(require("../../../database/entity/Department"));
const requestContext_1 = require("../../../context/requestContext");
const createDepartment = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { organizationId } = (0, requestContext_1.getContext)();
    const department = new Department_1.default();
    department.description = (_a = dto.description) !== null && _a !== void 0 ? _a : "";
    department.name = (_b = dto.name) !== null && _b !== void 0 ? _b : "";
    department.organizationId = organizationId;
    return yield dataSource_1.AppDataSource.manager.save(department);
});
exports.createDepartment = createDepartment;
const updateDepartment = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dto.id || !dto.description || !dto.name)
        throw new Error("Incorrect id or description");
    const { organizationId } = (0, requestContext_1.getContext)();
    const department = yield dataSource_1.AppDataSource.manager.findOneBy(Department_1.default, {
        id: dto.id,
        organizationId: organizationId,
    });
    if (!department)
        throw new Error("Department not found");
    department.description = dto.description;
    department.name = dto.name;
    return yield dataSource_1.AppDataSource.manager.save(department);
});
exports.updateDepartment = updateDepartment;
const findAllDepartments = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const queryBuilder = dataSource_1.AppDataSource.getRepository(Department_1.default)
        .createQueryBuilder("department")
        .where("department.organizationId= :organizationId", { organizationId });
    if (paginationOptions.search) {
        queryBuilder.andWhere("department.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("department.name", "ASC");
    const total = yield queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);
    const rawResults = yield queryBuilder.getMany();
    const departments = rawResults.map(department => {
        {
            return {
                id: department.id,
                description: department.description,
                name: department.name,
            };
        }
    });
    const totalPages = Math.ceil(total / limit);
    return {
        data: departments,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
});
exports.findAllDepartments = findAllDepartments;
