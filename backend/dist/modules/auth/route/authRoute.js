"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const authRoute = (0, express_1.Router)();
authRoute.post("/signup", authController_1.signUp);
authRoute.post("/login", authController_1.login);
exports.default = authRoute;
