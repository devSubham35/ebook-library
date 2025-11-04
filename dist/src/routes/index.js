"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const book_route_1 = __importDefault(require("./book.route"));
const auth_midleware_1 = require("../middlewares/auth.midleware");
const rootRouter = (0, express_1.Router)();
rootRouter.use("/auth", auth_route_1.default);
rootRouter.us("/books", auth_midleware_1.authenticateToken, book_route_1.default);
exports.default = rootRouter;
