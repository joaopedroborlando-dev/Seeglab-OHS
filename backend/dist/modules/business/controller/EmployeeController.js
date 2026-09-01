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
exports.deleteEmployee = exports.findAllEmployees = exports.updateEmployee = exports.createEmployee = void 0;
const service = __importStar(require("../service/EmployeeService"));
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data || !data.name)
            return res.status(400).send("BAD_REQUEST");
        const createdEmployee = yield service.createEmployee(data);
        return res.status(201).send(createdEmployee);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.createEmployee = createEmployee;
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data || !data.id)
            return res.status(400).send("BAD_REQUEST");
        const updatedEmployee = yield service.updateEmployee(data);
        return res.status(200).send(updatedEmployee);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.updateEmployee = updateEmployee;
const findAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const search = ((_a = req.body.filter) === null || _a === void 0 ? void 0 : _a.description) || req.body.search;
        const dbRes = yield service.findAllEmployees({ page, limit, search });
        return res.status(200).send(dbRes);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.findAllEmployees = findAllEmployees;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (!id)
            return res.status(400).send("BAD_REQUEST");
        yield service.deleteEmployee(id);
        return res.status(200).send({ message: "DELETED" });
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.deleteEmployee = deleteEmployee;
