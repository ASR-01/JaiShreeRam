"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_REFRESH_TOKEN_SECRET = exports.JWT_ACCESS_TOKEN_SECRET = exports.FRONTEND_URL = exports.EMAIL_FROM = exports.EMAIL_USER = exports.EMAIL_HOST = exports.APP_PASSWORD = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 8080;
exports.APP_PASSWORD = process.env.APP_PASSWORD;
exports.EMAIL_HOST = process.env.EMAIL_HOST;
exports.EMAIL_USER = process.env.EMAIL_USER;
exports.EMAIL_FROM = process.env.EMAIL_FROM;
exports.FRONTEND_URL = process.env.FRONTEND_HOST;
exports.JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
exports.JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
