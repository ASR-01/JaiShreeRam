import { Router } from "express";

import userRouter from "./user.route";

const rootRouter:Router = Router()


rootRouter.use("/v1",userRouter)


export default rootRouter