"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducts = exports.updateProducts = exports.createProducts = exports.getProductsAll = void 0;
const ProdutosService_1 = require("../services/ProdutosService");
const getProductsAll = async (req, res) => {
    try {
        const products = await (0, ProdutosService_1.getProducts)(); // Obtem os produtos
        res.status(200).json(products); // Envia a resposta ao cliente
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Erro interno do servidor" });
    }
};
exports.getProductsAll = getProductsAll;
const createProducts = async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;
        // Attempt to create the product
        const product = await (0, ProdutosService_1.createProduct)({ name, description, price, quantity });
        // If creation is successful, return the product
        res.status(201).json(product);
    }
    catch (error) {
        // Return error message if product creation fails
        res.status(400).json({ error: error.message || 'Error while creating product' });
    }
};
exports.createProducts = createProducts;
const updateProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, quantity, price } = req.body;
        const updatedProduct = await (0, ProdutosService_1.updateProduct)(Number(id), { name, description, quantity, price });
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};
exports.updateProducts = updateProducts;
const deleteProducts = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, ProdutosService_1.deleteProduct)(Number(id));
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
exports.deleteProducts = deleteProducts;
