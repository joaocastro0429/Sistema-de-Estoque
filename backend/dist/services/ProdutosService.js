"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/services/ProdutosService.ts
var ProdutosService_exports = {};
__export(ProdutosService_exports, {
  createProduct: () => createProduct,
  deleteProduct: () => deleteProduct,
  getProducts: () => getProducts,
  updateProduct: () => updateProduct
});
module.exports = __toCommonJS(ProdutosService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/services/ProdutosService.ts
var getProducts = () => __async(null, null, function* () {
  try {
    const products = yield prisma.product.findMany();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
});
var createProduct = (_0) => __async(null, [_0], function* ({ name, description, price, quantity }) {
  try {
    const existingProduct = yield prisma.product.findFirst({
      where: {
        name,
        description,
        price,
        quantity
      }
    });
    if (existingProduct) {
      throw new Error("Product with the same name, description, price, and quantity already exists.");
    }
    const product = yield prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity
      }
    });
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message || "Error creating product");
  }
});
var updateProduct = (id, data) => __async(null, null, function* () {
  return prisma.product.update({
    where: { id },
    data
  });
});
var deleteProduct = (id) => __async(null, null, function* () {
  try {
    const product = yield prisma.product.delete({
      where: { id }
    });
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Error deleting product");
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
});
