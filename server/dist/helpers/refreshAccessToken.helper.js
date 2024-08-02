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
exports.refreshAccessToken = void 0;
const errorHandler_utils_1 = __importDefault(require("../utils/errorHandler.utils"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("../secret");
const client_1 = __importDefault(require("../client"));
const token_utils_1 = __importDefault(require("../utils/token.utils"));
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        const { TokenDetails, error } = yield VerifyRefreshToken(oldRefreshToken);
        if (error || !TokenDetails) {
            return { error: "Invalid Refresh Token" };
        }
        const user = yield client_1.default.user.findFirst({
            where: { id: TokenDetails.id },
        });
        if (!user) {
            return { error: "User Not Found" };
        }
        const userRefreshToken = yield client_1.default.refreshTokens.findFirst({
            where: { userId: TokenDetails.id },
        });
        if (oldRefreshToken !== (userRefreshToken === null || userRefreshToken === void 0 ? void 0 : userRefreshToken.token) ||
            (userRefreshToken === null || userRefreshToken === void 0 ? void 0 : userRefreshToken.blackListed)) {
            return { error: "Unauthorized" };
        }
        const { accessToken, refreshToken } = yield (0, token_utils_1.default)(user);
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new errorHandler_utils_1.default("Internal Server Error", 500);
    }
});
exports.refreshAccessToken = refreshAccessToken;
const VerifyRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privateKey = secret_1.JWT_REFRESH_TOKEN_SECRET;
        const userRefreshToken = yield client_1.default.refreshTokens.findFirst({
            where: {
                token: refreshToken,
            },
        });
        if (!userRefreshToken) {
            return { error: true, msg: "Invalid Token" };
        }
        const TokenDetails = jsonwebtoken_1.default.verify(refreshToken, privateKey);
        console.log(TokenDetails);
        return {
            TokenDetails,
            error: false,
            msg: "Token is Valid",
        };
    }
    catch (error) {
        return { error: true, msg: "Invalid Token" };
    }
});
