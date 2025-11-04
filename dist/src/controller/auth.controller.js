"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const config_1 = require("../config/config");
///////////////////////////////////////
/// Sign Up
///////////////////////////////////////
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Basic field validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if user already exists
        const existingUser = await app_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password with bcrypt
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create new user with hashed password
        const newUser = await app_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        // Return response (omit password)
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.signup = signup;
///////////////////////////////////////
/// Login
///////////////////////////////////////
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Basic field validation
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if user already exists
        const existingUser = await app_1.prisma.user.findUnique({
            where: { email },
        });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exists, Please register!" });
        }
        // Hash password with bcrypt
        const isMatched = await bcrypt_1.default.compare(password, existingUser.password);
        if (!isMatched) {
            res.status(400).json({
                message: "Invalid Credential",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser?.id,
            email: existingUser?.email
        }, config_1.config.jwt_secret, { expiresIn: "7d" });
        res.status(200).json({
            message: "User logged in successfully",
            data: {
                token,
                user: {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                }
            }
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.login = login;
