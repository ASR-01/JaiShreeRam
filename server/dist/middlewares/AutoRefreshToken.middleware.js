"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoRefreshTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../utils/asyncHandler");
const errorHandler_utils_1 = __importDefault(require("../utils/errorHandler.utils"));
const setTokenCookies_utils_1 = require("../utils/setTokenCookies.utils");
const refreshAccessToken_helper_1 = require("../helpers/refreshAccessToken.helper");
const isTokenExpired = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || typeof decoded.exp === "undefined") {
            return true;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decoded.exp;
        // Check if the token is expired
        return currentTime >= expirationTime;
    }
    catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};
exports.autoRefreshTokens = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenAcc = req.cookies.accessToken;
    const refreshTokenAcc = req.cookies.refreshToken;
    // Check if the access token is valid
    if (accessTokenAcc && !isTokenExpired(accessTokenAcc)) {
        req.headers["authorization"] = `Bearer ${accessTokenAcc}`;
        return next(); // Proceed to the next middleware
    }
    // If access token is expired or not present, check for refresh token
    if (!refreshTokenAcc) {
        return next(new errorHandler_utils_1.default("Please log in", 401)); // Change to a 401 Unauthorized error
    }
    // Attempt to refresh access and refresh tokens
    try {
        const { accessToken, refreshToken } = yield (0, refreshAccessToken_helper_1.refreshAccessToken)(req, res);
        // Ensure accessToken is defined before calling setTokenCookies
        if (accessToken && refreshToken) {
            (0, setTokenCookies_utils_1.setTokenCookies)(res, accessToken, refreshToken);
            req.headers["authorization"] = `Bearer ${accessToken}`;
            return next(); // Proceed to the next middleware
        }
        else {
            return next(new errorHandler_utils_1.default("Failed to refresh access token", 500));
        }
    }
    catch (error) {
        console.error("Error refreshing tokens:", error);
        return next(new errorHandler_utils_1.default("Failed to refresh tokens", 500));
    }
}));
