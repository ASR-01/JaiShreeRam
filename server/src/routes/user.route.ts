import { Router } from "express";
import {
  ChangePassword,
  Login,
  Logout,
  profile,
  RequestNewOtp,
  resetPasswordEmail,
  userPasswordReset,
  UserRegistration,
  VerifyEmail,
} from "../controllers/user.controller";
import passport from "passport";
import { autoRefreshTokens } from "../middlewares/AutoRefreshToken.middleware";

const userRouter: Router = Router();

userRouter.post("/register", UserRegistration);
userRouter.post("/verify", VerifyEmail);
userRouter.post("/requestNewOtp", RequestNewOtp);
userRouter.post("/login", Login);
// userRouter.post("/refresh-token", getNewAccessToken);
userRouter.post("/logout", Logout);
userRouter.post("/reset-password-link", resetPasswordEmail);
userRouter.post("/reset-password/:id/:token", userPasswordReset);

// Auth Routes
userRouter.get(
  "/profile",
  autoRefreshTokens,
  passport.authenticate("jwt", { session: false }),
  profile
);
userRouter.post(
  "/change-password",
  autoRefreshTokens,
  passport.authenticate("jwt", { session: false }),
  ChangePassword
);


export default userRouter;
