"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//define a classe tipo erro
class AppError {
    constructor(message, statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.default = AppError;
