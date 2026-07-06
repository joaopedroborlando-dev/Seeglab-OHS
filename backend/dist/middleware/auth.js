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
exports.auth = void 0;
const jwt_1 = require("../auth/jwt");
const requestContext_1 = require("../context/requestContext");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.path.startsWith('/auth/')) {
        return next();
    }
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }
        const token = authorization.replace('Bearer ', '');
        const payload = (0, jwt_1.verifyToken)(token);
        const { userId, organizationId } = payload;
        requestContext_1.requestContext.run({ organizationId, userId }, () => {
            next();
        });
    }
    catch (err) {
        res.status(401).send("UNAUTHORIZED");
    }
});
exports.auth = auth;
