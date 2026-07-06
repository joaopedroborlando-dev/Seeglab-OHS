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
exports.SeedHazards1752360956654 = void 0;
class SeedHazards1752360956654 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            INSERT INTO hazard (description, color, "createdAt", "updatedAt")
            VALUES
                ('PHYSICAL', '#ea9999', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW())),
                ('CHEMICAL', '#ea9999', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW())),
                ('BIOLOGICAL', '#aa9d8a', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW())),
                ('ERGONOMIC', '#ffe599', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW())),
                ('ACCIDENT', '#9fc5e8', EXTRACT(EPOCH FROM NOW()), EXTRACT(EPOCH FROM NOW()))
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.SeedHazards1752360956654 = SeedHazards1752360956654;
