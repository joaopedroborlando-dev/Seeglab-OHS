"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = exports.requestContext = void 0;
const async_hooks_1 = require("async_hooks");
exports.requestContext = new async_hooks_1.AsyncLocalStorage();
const getContext = () => {
    const store = exports.requestContext.getStore();
    if (!store) {
        throw new Error("NO_CONTEXT");
    }
    return store;
};
exports.getContext = getContext;
