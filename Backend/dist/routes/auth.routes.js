"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const authRouter = (0, express_1.Router)();
authRouter.post("/register", auth_controller_1.Register);
authRouter.post("/login", auth_controller_1.Login);
authRouter.get("/profile", authMiddleware_1.default, auth_controller_1.profile);
authRouter.post("/refresh-token", auth_controller_1.refreshToken);
exports.default = authRouter;
