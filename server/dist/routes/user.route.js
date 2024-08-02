"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const passport_1 = __importDefault(require("passport"));
const AutoRefreshToken_middleware_1 = require("../middlewares/AutoRefreshToken.middleware");
const userRouter = (0, express_1.Router)();
userRouter.post("/register", user_controller_1.UserRegistration);
userRouter.post("/verify", user_controller_1.VerifyEmail);
userRouter.post("/requestNewOtp", user_controller_1.RequestNewOtp);
userRouter.post("/login", user_controller_1.Login);
// userRouter.post("/refresh-token", getNewAccessToken);
userRouter.post("/logout", user_controller_1.Logout);
userRouter.post("/reset-password-link", user_controller_1.resetPasswordEmail);
userRouter.post("/reset-password/:id/:token", user_controller_1.userPasswordReset);
// Auth Routes
userRouter.get("/profile", AutoRefreshToken_middleware_1.autoRefreshTokens, passport_1.default.authenticate("jwt", { session: false }), user_controller_1.profile);
userRouter.post("/change-password", AutoRefreshToken_middleware_1.autoRefreshTokens, passport_1.default.authenticate("jwt", { session: false }), user_controller_1.ChangePassword);
exports.default = userRouter;
