"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductRouter_1 = require("./router/ProductRouter");
const UserRouter_1 = require("./router/UserRouter");
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use((0, cors_1.default)());
server.use(ProductRouter_1.router);
server.use(UserRouter_1.UserRouter);
server.listen(4444);
