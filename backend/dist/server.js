"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/server.ts
var import_express3 = __toESM(require("express"));

// src/router/ProductRouter.ts
var import_express = require("express");

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

// src/controllers/ProductsController.ts
var getProductsAll = (req, res) => __async(null, null, function* () {
  try {
    const products = yield getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});
var createProducts = (req, res) => __async(null, null, function* () {
  try {
    const { name, description, price, quantity } = req.body;
    const product = yield createProduct({ name, description, price, quantity });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message || "Error while creating product" });
  }
});
var updateProducts = (req, res) => __async(null, null, function* () {
  try {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const updatedProduct = yield updateProduct(Number(id), { name, description, quantity, price });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});
var deleteProducts = (req, res) => __async(null, null, function* () {
  try {
    const { id } = req.params;
    yield deleteProduct(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// src/middleware/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var authMiddleware = (req, res, next) => {
  var _a;
  const token = (_a = req.header("Authorization")) == null ? void 0 : _a.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
  import_jsonwebtoken.default.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// src/router/ProductRouter.ts
var router = (0, import_express.Router)();
router.get("/getProducts", getProductsAll);
router.post("/addProducts", authMiddleware, createProducts);
router.put("/updateProducts/:id", authMiddleware, updateProducts);
router.delete("/deleteProducts/:id", authMiddleware, deleteProducts);

// src/router/UserRouter.ts
var import_express2 = require("express");

// src/services/UserService.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var loginUser = (email, password) => __async(null, null, function* () {
  return yield prisma.user.create({
    data: {
      email,
      password
    }
  });
});
var loginFind = (email, password) => __async(null, null, function* () {
  try {
    const user = yield prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = yield import_bcryptjs.default.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return user;
  } catch (error) {
    throw new Error(error.message || "Error during login");
  }
});

// src/controllers/authController.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var register = (req, res) => __async(null, null, function* () {
  try {
    const { email, password } = req.body;
    const hashPassword = yield import_bcryptjs2.default.hash(password, 10);
    const user = yield loginUser(email, hashPassword);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message || "Error login" });
  }
});
var login = (req, res) => __async(null, null, function* () {
  const { email, password } = req.body;
  const user = yield loginFind(email, password);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const isPasswordValid = yield import_bcryptjs2.default.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ error: "Invalid credentials" });
  const token = import_jsonwebtoken2.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return res.json({ user, token });
});

// src/router/UserRouter.ts
var UserRouter = (0, import_express2.Router)();
UserRouter.post("/register", register);
UserRouter.post("/login", login);

// src/server.ts
var import_cors = __toESM(require("cors"));
var server = (0, import_express3.default)();
server.use(import_express3.default.json());
server.use((0, import_cors.default)());
server.use(router);
server.use(UserRouter);
server.listen(4444);
