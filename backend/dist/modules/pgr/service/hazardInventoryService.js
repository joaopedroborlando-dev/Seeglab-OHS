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
exports.findOneById = exports.findAllInventories = exports.createHazardInventory = void 0;
const dataSource_1 = require("../../../database/dataSource");
const HazardInventory_1 = __importDefault(require("../../../database/entity/HazardInventory"));
const requestContext_1 = require("../../../context/requestContext");
const hazardInventoryRepository_1 = require("../repository/hazardInventoryRepository");
const WorkUnitMapper_1 = require("../mapper/WorkUnitMapper");
const createHazardInventory = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationId } = (0, requestContext_1.getContext)();
    const inventory = new HazardInventory_1.default();
    if (dto.description)
        inventory.description = dto.description;
    inventory.name = dto.name;
    inventory.organizationId = organizationId;
    return yield dataSource_1.AppDataSource.manager.save(inventory);
});
exports.createHazardInventory = createHazardInventory;
const findAllInventories = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const { organizationId } = (0, requestContext_1.getContext)();
    const queryBuilder = dataSource_1.AppDataSource.getRepository(HazardInventory_1.default)
        .createQueryBuilder("inventory")
        .where("inventory.organizationId = :organizationId", { organizationId });
    if (paginationOptions.search) {
        queryBuilder.andWhere("inventory.name ILIKE :search", {
            search: `%${paginationOptions.search}%`
        });
    }
    queryBuilder.addOrderBy("inventory.name", "ASC");
    const total = yield queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);
    const rawResults = yield queryBuilder.getMany();
    const inventory = rawResults.map(inventory => {
        {
            return {
                id: inventory === null || inventory === void 0 ? void 0 : inventory.id,
                name: inventory.name,
                description: inventory.description,
                createdAt: inventory.createdAt,
            };
        }
    });
    const totalPages = Math.ceil(total / limit);
    return {
        data: inventory,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
});
exports.findAllInventories = findAllInventories;
const findOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("INCORRECT_DATA");
    const { organizationId } = (0, requestContext_1.getContext)();
    const inventory = yield hazardInventoryRepository_1.HazardInventoryRepository.findOneById(id, organizationId);
    if (!inventory)
        throw new Error("INCORRECT_DATA");
    return {
        id: inventory.id,
        name: inventory.name,
        description: inventory.description,
        workUnits: WorkUnitMapper_1.WorkUnitMapper.toDtoList(inventory.workUnits),
    };
});
exports.findOneById = findOneById;
