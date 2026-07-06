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
exports.getManyPaginated = void 0;
const getManyPaginated = (paginationOptions, queryBuilder) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(1, paginationOptions.page || 1);
    const limit = Math.max(1, Math.min(100, paginationOptions.limit || 10));
    const skip = (page - 1) * limit;
    const total = yield queryBuilder.getCount();
    queryBuilder.skip(skip).take(limit);
    const resultArr = yield queryBuilder.getMany();
    const totalPages = Math.ceil(total / limit);
    return {
        data: resultArr,
        meta: {
            page,
            limit,
            total,
            totalPages
        }
    };
});
exports.getManyPaginated = getManyPaginated;
