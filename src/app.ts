import dotenv from "dotenv";
import express from "express";
import rootRouter from "./routes";
import { PrismaClient } from "./generated/prisma/client";
import { errorMiddleware } from "./middlewares/error.middleware";


dotenv.config();

const app = express();
app.use(express.json());
export const prisma = new PrismaClient();


app.use("/api", rootRouter);

app.use(errorMiddleware);

export default app;