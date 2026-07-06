"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidation = void 0;
const requestContext_1 = require("../context/requestContext");
const requestValidation = (req, res, next) => {
    const { organizationId, userId } = (0, requestContext_1.getContext)();
    if (!userId || !organizationId) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }
    next();
};
exports.requestValidation = requestValidation;
