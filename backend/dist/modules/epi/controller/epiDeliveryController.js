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
exports.createDelivery = exports.getRecommendations = exports.getDeliveryContext = void 0;
const service = __importStar(require("../service/epiDeliveryService"));
const getDeliveryContext = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventoryId = parseInt(req.query.inventoryId);
        if (!inventoryId)
            return res.status(400).send("inventoryId is required");
        const context = yield service.getDeliveryContext(inventoryId);
        return res.status(200).send(context);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.getDeliveryContext = getDeliveryContext;
const getRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workUnitId = parseInt(req.query.workUnitId);
        if (!workUnitId)
            return res.status(400).send("workUnitId is required");
        const recommendations = yield service.getRecommendations(workUnitId);
        return res.status(200).send(recommendations);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.getRecommendations = getRecommendations;
const createDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!data || !data.employeeId || !data.items) {
            return res.status(400).send("BAD_REQUEST: employeeId and items are required");
        }
        const delivery = yield service.createDelivery(data);
        return res.status(201).send(delivery);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
exports.createDelivery = createDelivery;
