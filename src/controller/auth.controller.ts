
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../app";
import { config } from "../config/config";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

///////////////////////////////////////
/// Sign Up
///////////////////////////////////////

export const signup = asyncHandler(async (req: Request, res: Response) => {

  const { name, email, password } = req.body;

  /// Basic field validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  /// Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists!")
  }

  /// Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  /// Create new user with hashed password
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json(new ApiResponse(201,
    {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
    },
    "User created successfully"
  ));

});



///////////////////////////////////////
/// Login
///////////////////////////////////////

export const login = asyncHandler(async (req: Request, res: Response) => {

  const { email, password } = req.body;

  /// Basic field validation
  if (!email || !password) {
    throw new ApiError(400, "All fields are required!")
  }

  /// Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    throw new ApiError(400, "User does not exists, Please register!")
  }

  /// Hash password with bcrypt
  const isMatched = await bcrypt.compare(password, existingUser.password);

  if (!isMatched) {
    throw new ApiError(400, "Invalid Credential!")
  }

  const token = jwt.sign(
    {
      userId: existingUser?.id,
      email: existingUser?.email
    },
    config.jwt_secret,
    { expiresIn: "7d" }
  )


  const loginData = {
    token,
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    }
  }

  return res.status(200).json(new ApiResponse(200, loginData, "User logged in successfully"));

});

