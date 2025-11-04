import { config } from "../config/config";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";

interface JwtUserPayload {
    userId: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JwtUserPayload;
}

export const authenticateToken = asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) throw new ApiError(400, "Unauthorize access!");

    try {
        const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;

        if (!decoded || typeof decoded !== "object" || !decoded.userId || !decoded.email) {
            throw new ApiError(400, "Invalid token payload");
        }

        req.user = {
            userId: decoded.userId as string,
            email: decoded.email as string,
        };

        next();
    } catch (error) {
        console.error("Error:", error);
        throw new ApiError(403, "Invalid or expired token");
    }
});
