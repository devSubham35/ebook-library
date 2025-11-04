import { Router } from "express";
import authRouter from "./auth.route";
import bookRouter from "./book.route";
import { authenticateToken } from "../middlewares/auth.midleware";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/books", authenticateToken, bookRouter);

export default rootRouter;