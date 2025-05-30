"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const index_1 = require("../prisma/index");
;
// Fetch all products
const getProducts = async () => {
    try {
        const products = await index_1.prisma.product.findMany();
        return products;
    }
    catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Error fetching products');
    }
};
exports.getProducts = getProducts;
// Function to create a product
const createProduct = async ({ name, description, price, quantity }) => {
    try {
        // Check if a product with the same name, description, price, and quantity already exists
        const existingProduct = await index_1.prisma.product.findFirst({
            where: {
                name,
                description,
                price,
                quantity,
            },
        });
        // If the product exists, throw an error
        if (existingProduct) {
            throw new Error('Product with the same name, description, price, and quantity already exists.');
        }
        // If no duplicate is found, proceed to create the new product
        const product = await index_1.prisma.product.create({
            data: {
                name,
                description,
                price,
                quantity,
            },
        });
        return product;
    }
    catch (error) {
        console.error('Error creating product:', error);
        throw new Error(error.message || 'Error creating product');
    }
};
exports.createProduct = createProduct;
// Function to update a product
const updateProduct = async (id, data) => {
    return index_1.prisma.product.update({
        where: { id },
        data,
    });
};
exports.updateProduct = updateProduct;
// Function to delete a product
const deleteProduct = async (id) => {
    try {
        const product = await index_1.prisma.product.delete({
            where: { id },
        });
        return product;
    }
    catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Error deleting product');
    }
};
exports.deleteProduct = deleteProduct;
