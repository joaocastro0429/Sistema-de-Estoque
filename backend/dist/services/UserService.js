"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginFind = exports.loginUser = void 0;
const prisma_1 = require("../prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginUser = async (email, password) => {
    return await prisma_1.prisma.user.create({
        data: {
            email,
            password
        },
    });
};
exports.loginUser = loginUser;
const loginFind = async (email, password) => {
    try {
        // Buscar o usuário pelo email
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        // Verificar se o usuário existe
        if (!user) {
            throw new Error('User not found');
        }
        // Comparar a senha fornecida com a senha armazenada
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        return user;
    }
    catch (error) {
        throw new Error(error.message || 'Error during login');
    }
};
exports.loginFind = loginFind;
