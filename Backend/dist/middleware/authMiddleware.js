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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens_helper_1 = __importDefault(require("../helpers/generateTokens.helper"));
const secrets_1 = require("../secrets");
const client_1 = __importDefault(require("../client"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken) {
        return res
            .status(401)
            .json({ success: false, error: "No token, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, secrets_1.JWT_SECRET);
        const user = yield client_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError && refreshToken) {
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, secrets_1.JWT_SECRET);
                const user = yield client_1.default.user.findUnique({
                    where: { id: decoded.id },
                });
                if (!user) {
                    return res
                        .status(401)
                        .json({ success: false, error: "Invalid token" });
                }
                accessToken = (0, generateTokens_helper_1.default)(user.id, "15m");
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });
                req.user = user;
                next();
            }
            catch (refreshErr) {
                res.status(401).json({ success: false, error: "Token is not valid" });
            }
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ success: false, error: "Token is not valid" });
        }
        else {
            res.status(401).json({ success: false, error: "Authorization error" });
        }
    }
});
exports.protect = protect;
exports.default = exports.protect;
