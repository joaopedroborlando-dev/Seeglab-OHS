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
exports.deleteEmployee = exports.findAllEmployees = exports.updateEmployee = exports.createEmployee = void 0;
const dataSource_1 = require("../../../database/dataSource");
const Employee_1 = __importDefault(require("../../../database/entity/Employee"));
const Role_1 = __importDefault(require("../../../database/entity/Role"));
const requestContext_1 = require("../../../context/requestContext");
const EmployeeMapper_1 = require("../mapper/EmployeeMapper");
const typeorm_1 = require("typeorm");
const createEmployee = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const employee = new Employee_1.default();
    const { organizationId } = (0, requestContext_1.getContext)();
    employee.name = (_a = dto.name) !== null && _a !== void 0 ? _a : "";
    employee.birthDate = dto.birthDate ? new Date(dto.birthDate) : null;
    employee.maritalStatus = (_b = dto.maritalStatus) !== null && _b !== void 0 ? _b : null;
    employee.CPF = (_c = dto.CPF) !== null && _c !== void 0 ? _c : null;
    employee.PIS = (_d = dto.PIS) !== null && _d !== void 0 ? _d : null;
    employee.post = (_e = dto.post) !== null && _e !== void 0 ? _e : null;
    employee.organizationId = organizationId;
    if (dto.roleIds && dto.roleIds.length > 0) {
        const roles = yield dataSource_1.AppDataSource.getRepository(Role_1.default).findBy({
            id: (0, typeorm_1.In)(dto.roleIds)
        });
        employee.roles = roles;
    }
    return yield dataSource_1.AppDataSource.manager.save(employee);
});
exports.createEmployee = createEmployee;
const updateEmployee = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dto.id)
        throw new Error("INVALID_DATA");
    const { organizationId } = (0, requestContext_1.getContext)();
    const employee = yield dataSource_1.AppDataSource.manager.findOne(Employee_1.default, {
        where: { id: dto.id, organizationId },
        relations: ["roles"]
    });
    if (!employee)
        throw new Error("EMPLOYEE_NOT_FOUND");
    if (dto.name)
        employee.name = dto.name;
    if (dto.birthDate !== undefined)
        employee.birthDate = dto.birthDate ? new Date(dto.birthDate) : null;
    if (dto.maritalStatus !== undefined)
        employee.maritalStatus = dto.maritalStatus;
    if (dto.CPF !== undefined)
        employee.CPF = dto.CPF;
    if (dto.PIS !== undefined)
        employee.PIS = dto.PIS;
    if (dto.post !== undefined)
        employee.post = dto.post;
    if (dto.roleIds) {
        const roles = yield dataSource_1.AppDataSource.getRepository(Role_1.default).findBy({
            id: (0, typeorm_1.In)(dto.roleIds)
        });
        employee.roles = roles;
    }
    return yield dataSource_1.AppDataSource.manager.save(employee);
});
exports.updateEmployee = updateEmployee;
const findAllEmployees = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { organizationId } = (0, requestContext_1.getContext)();
    const queryBuilder = dataSource_1.AppDataSource.getRepository(Employee_1.default)
        .createQueryBuilder("employee")
        .leftJoinAndSelect("employee.roles", "role")
        .where("employee.organizationId = :organizationId", { organizationId });
    if (paginationOptions.search) {
        queryBuilder.andWhere("employee.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("employee.name", "ASC");
    const total = yield queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);
    const rawResults = yield queryBuilder.getMany();
    const employees = rawResults.map(emp => EmployeeMapper_1.EmployeeMapper.toDto(emp));
    const totalPages = Math.ceil(total / limit);
    return {
        data: employees,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
});
exports.findAllEmployees = findAllEmployees;
const deleteEmployee = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    const employee = yield dataSource_1.AppDataSource.manager.findOneBy(Employee_1.default, { id, organizationId });
    if (!employee)
        throw new Error("EMPLOYEE_NOT_FOUND");
    yield dataSource_1.AppDataSource.manager.remove(employee);
});
exports.deleteEmployee = deleteEmployee;
