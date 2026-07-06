"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.findAllRolesByDepartmentId = exports.findAllRoles = exports.updateRole = exports.createRole = void 0;
const service = __importStar(require("../service/roleService"));
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data || !data.departmentId || !data.description)
            return res.status(400).send("BAD_REQUEST");
        const createdRole = yield service.createRole(data);
        return res.status(201).send(createdRole);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.createRole = createRole;
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data || !data.id)
            return res.status(400).send("BAD_REQUEST");
        const updatedRole = yield service.updateRole(data);
        return res.status(200).send(updatedRole);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.updateRole = updateRole;
const findAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const search = req.query.search;
        const dbRes = yield service.findAllRoles({ page, limit, search });
        return res.status(200).send(dbRes);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.findAllRoles = findAllRoles;
const findAllRolesByDepartmentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 100;
        const search = req.body.search;
        const departmentId = parseInt(req.body.departmentId) || -1;
        const dbRes = yield service.findAllRolesByDepartmentId({ page, limit, search }, departmentId);
        return res.status(200).send(dbRes);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.findAllRolesByDepartmentId = findAllRolesByDepartmentId;
