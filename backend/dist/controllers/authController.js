"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/controllers/authController.ts
var authController_exports = {};
__export(authController_exports, {
  login: () => login,
  register: () => register
});
module.exports = __toCommonJS(authController_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

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
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
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
  const token = import_jsonwebtoken.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return res.json({ user, token });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  login,
  register
});
