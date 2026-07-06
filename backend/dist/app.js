"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./middleware/auth");
require("reflect-metadata");
const dataSource_1 = require("./database/dataSource"); //não remover -> type ORM
//Routes
const route_1 = __importDefault(require("./route/route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3001;
// Database connection
dataSource_1.AppDataSource.initialize()
    .then(() => {
    console.log("PostgresSQL server started");
})
    .catch((error) => console.log(error));
// Apply authentication middleware globally
app.use(auth_1.auth);
app.get("/api/test", (req, res, next) => {
    res.send("Authentication successful!");
});
// Using Routes
app.use(route_1.default);
app.listen(PORT, () => {
    console.log(`Core API Service running on port ${PORT}`);
});
