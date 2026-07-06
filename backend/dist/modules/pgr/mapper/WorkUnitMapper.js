"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkUnitMapper = void 0;
const RoleMapper_1 = require("../../business/mapper/RoleMapper");
const HazardAssessmentMapper_1 = require("./HazardAssessmentMapper");
class WorkUnitMapper {
    static toDto(entity) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!entity) {
            throw new Error('WorkUnit entity is required');
        }
        return {
            id: entity.id,
            name: entity.name,
            departmentId: (_a = entity.department) === null || _a === void 0 ? void 0 : _a.id,
            inventoryId: (_b = entity.inventory) === null || _b === void 0 ? void 0 : _b.id,
            inventoryName: (_c = entity.inventory) === null || _c === void 0 ? void 0 : _c.name,
            departmentName: (_d = entity.department) === null || _d === void 0 ? void 0 : _d.name,
            inventoryDescription: (_e = entity.inventory) === null || _e === void 0 ? void 0 : _e.description,
            departmentDescription: (_f = entity.department) === null || _f === void 0 ? void 0 : _f.description,
            roles: ((_g = entity.roles) === null || _g === void 0 ? void 0 : _g.map(role => RoleMapper_1.RoleMapper.toDto(role))) || [],
            hazardAssessments: ((_h = entity.hazardAssessments) === null || _h === void 0 ? void 0 : _h.map(assessment => HazardAssessmentMapper_1.HazardAssessmentMapper.toDto(assessment))) || [],
        };
    }
    static toDtoList(entities) {
        return entities.map(entity => this.toDto(entity));
    }
}
exports.WorkUnitMapper = WorkUnitMapper;
