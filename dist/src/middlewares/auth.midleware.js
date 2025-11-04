"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Unauthorize access!" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt_secret);
        if (!decoded || typeof decoded !== "object" || !decoded.userId || !decoded.email) {
            return res.status(403).json({ message: "Invalid token payload" });
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};
exports.authenticateToken = authenticateToken;
