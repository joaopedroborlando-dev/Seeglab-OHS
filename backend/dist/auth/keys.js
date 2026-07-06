"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicKey = exports.privateKey = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const privateKeyPath = path_1.default.join(__dirname, "keys", "private.key");
const publicKeyPath = path_1.default.join(__dirname, "keys", "public.key");
exports.privateKey = fs_1.default.readFileSync(privateKeyPath, "utf8");
exports.publicKey = fs_1.default.readFileSync(publicKeyPath, "utf8");
