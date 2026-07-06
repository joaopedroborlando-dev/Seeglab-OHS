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
exports.findRelatedWorkUnits = exports.findLastUpdatedWorkUnit = exports.deleteWorkUnit = exports.createWorkUnit = exports.findManyByInventoryId = void 0;
const service = __importStar(require("../service/workUnitService"));
const findManyByInventoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        return res.status(200).send(yield service.findManyByInventoryId(data.inventoryId));
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.findManyByInventoryId = findManyByInventoryId;
const createWorkUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data || !data.departmentId || !data.inventoryId)
            return res.status(400).send("Bad Request");
        const createdDept = yield service.createWorkUnit(data);
        return res.status(201).send(createdDept);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.createWorkUnit = createWorkUnit;
const deleteWorkUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.query.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "INVALID_ID" });
        }
        const deleted = yield service.deleteById(id);
        return res.status(200).send(deleted);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.deleteWorkUnit = deleteWorkUnit;
const findLastUpdatedWorkUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workUnit = yield service.findLastUpdatedWorkUnit();
        return res.status(200).send(workUnit);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.findLastUpdatedWorkUnit = findLastUpdatedWorkUnit;
const findRelatedWorkUnits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.query.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "INVALID_ID" });
        }
        const workUnit = yield service.findRelatedWorkUnits(id);
        return res.status(200).json(workUnit);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.findRelatedWorkUnits = findRelatedWorkUnits;
