import { Router } from "express";
import {
  Login,
  profile,
  refreshToken,
  Register,
} from "../controllers/auth.controller";
import protect from "../middleware/authMiddleware";


const authRouter: Router = Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.get("/profile", protect, profile);
authRouter.post("/refresh-token", refreshToken);

export default authRouter;
