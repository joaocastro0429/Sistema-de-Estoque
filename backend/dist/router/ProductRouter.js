"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const ProductsController_1 = require("../controllers/ProductsController");
const auth_1 = require("../middleware/auth");
exports.router = (0, express_1.Router)();
exports.router.get('/getProducts', ProductsController_1.getProductsAll);
// Rotas protegidas por autenticação
exports.router.post('/addProducts', auth_1.authMiddleware, ProductsController_1.createProducts);
exports.router.put('/updateProducts/:id', auth_1.authMiddleware, ProductsController_1.updateProducts);
exports.router.delete('/deleteProducts/:id', auth_1.authMiddleware, ProductsController_1.deleteProducts);
