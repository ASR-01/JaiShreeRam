import { Router } from "express";
import authRouter from "./auth.routes";

const indexRouter:Router = Router()

indexRouter.use("/auth", authRouter)


export default indexRouter;