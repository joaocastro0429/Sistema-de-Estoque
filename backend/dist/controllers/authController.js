"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const UserService_1 = require("../services/UserService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await (0, UserService_1.loginUser)(email, hashPassword);
        console.log(user);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Error login" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await (0, UserService_1.loginFind)(email, password);
    if (!user)
        return res.status(400).json({ error: 'Invalid credentials' });
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid)
        return res.status(400).json({ error: 'Invalid credentials' });
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ user, token });
};
exports.login = login;
