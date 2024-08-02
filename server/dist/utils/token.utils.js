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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("../secret");
const client_1 = __importDefault(require("../client"));
const generateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = { id: user.id, role: user.role };
    // Access Token
    const accessToken = jsonwebtoken_1.default.sign(payload, secret_1.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "10m", // 10 min 
    });
    // Refresh Token
    const refreshToken = jsonwebtoken_1.default.sign(payload, secret_1.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: "5d", // 5 days
    });
    const userRefreshToken = yield client_1.default.refreshTokens.findFirst({
        where: { userId: user.id },
    });
    if (userRefreshToken) {
        yield client_1.default.refreshTokens.delete({
            where: { id: userRefreshToken.id },
        });
    }
    yield client_1.default.refreshTokens.create({
        data: {
            userId: user.id,
            token: refreshToken,
        },
    });
    return { accessToken, refreshToken };
});
exports.default = generateToken;
