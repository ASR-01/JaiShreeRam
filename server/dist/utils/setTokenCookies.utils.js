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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenCookies = void 0;
const setTokenCookies = (res, accessToken, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 10 * 60 * 1000, // 10 minutes
        sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        sameSite: "strict",
    });
    res.cookie("is_Auth", true, {
        httpOnly: false,
        secure: false,
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        sameSite: "strict",
    });
});
exports.setTokenCookies = setTokenCookies;
