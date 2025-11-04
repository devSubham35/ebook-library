/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";


/// Global Error Middleware
const errorMiddleware = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = "Something went wrong";

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
};

export { errorMiddleware };