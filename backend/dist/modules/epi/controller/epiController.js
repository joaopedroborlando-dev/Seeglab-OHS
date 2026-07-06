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
exports.deleteEpi = exports.findAllEpis = exports.updateEpi = exports.createEpi = void 0;
const service = __importStar(require("../service/epiService"));
const createEpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data || !data.name)
            return res.status(400).send("BAD_REQUEST");
        const epi = yield service.createEpi(data);
        return res.status(201).send(epi);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.createEpi = createEpi;
const updateEpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data || !data.id)
            return res.status(400).send("BAD_REQUEST");
        const epi = yield service.updateEpi(data);
        return res.status(200).send(epi);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.updateEpi = updateEpi;
const findAllEpis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const filter = req.body.filter;
        const dbRes = yield service.findAllEpis({ page, limit, filter });
        return res.status(200).send(dbRes);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.findAllEpis = findAllEpis;
const deleteEpi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        return res.status(200).send(yield service.deleteEpi(id));
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.deleteEpi = deleteEpi;
