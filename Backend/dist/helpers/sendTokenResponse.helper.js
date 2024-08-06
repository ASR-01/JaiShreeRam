"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateTokens_helper_1 = __importDefault(require("./generateTokens.helper"));
const secrets_1 = require("../secrets");
const sendTokenResponse = (user, statusCode, res) => {
    const accessToken = (0, generateTokens_helper_1.default)(user.id, "15m");
    const refreshToken = (0, generateTokens_helper_1.default)(user.id, "7d");
    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: secrets_1.NODE_ENV === "production",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: secrets_1.NODE_ENV === "production",
    });
    res.status(statusCode).json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken,
        },
    });
};
exports.default = sendTokenResponse;
