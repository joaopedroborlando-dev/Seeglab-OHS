"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppErrors_1 = __importDefault(require("./AppErrors"));
const ErrorHandler = (err, request, response, _) => {
    /**
     * Verifica se o erro disparado é um AppError
     */
    if (err instanceof AppErrors_1.default) {
        console.log("entrou no handler do AppError");
        // envia uma resposta com o status e mensagem definidos no AppError
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }
    // eslint-disable-next-line no-console
    console.error(err);
    /**
     * Se foi um erro inesperado, irá responder com status 500 e a mensagem
     * do erro.
     */
    return response.status(500).json({
        status: "error",
        message: `Internal server error: ${err.message}`,
    });
};
exports.default = ErrorHandler;
