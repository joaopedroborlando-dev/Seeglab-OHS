"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeMapper = void 0;
const RoleMapper_1 = require("./RoleMapper");
class EmployeeMapper {
    static toDto(entity) {
        var _a, _b, _c, _d, _e;
        if (!entity) {
            throw new Error('Employee entity is required');
        }
        return {
            id: entity.id,
            name: entity.name,
            birthDate: (_a = entity.birthDate) !== null && _a !== void 0 ? _a : undefined,
            maritalStatus: (_b = entity.maritalStatus) !== null && _b !== void 0 ? _b : undefined,
            CPF: (_c = entity.CPF) !== null && _c !== void 0 ? _c : undefined,
            PIS: (_d = entity.PIS) !== null && _d !== void 0 ? _d : undefined,
            post: (_e = entity.post) !== null && _e !== void 0 ? _e : undefined,
            roles: entity.roles ? entity.roles.map(r => RoleMapper_1.RoleMapper.toDto(r)) : [],
        };
    }
}
exports.EmployeeMapper = EmployeeMapper;
