"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
exports.UserRouter = (0, express_1.Router)();
exports.UserRouter.post('/register', authController_1.register);
exports.UserRouter.post('/login', authController_1.login);
