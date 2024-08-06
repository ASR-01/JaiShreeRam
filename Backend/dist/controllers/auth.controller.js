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
exports.refreshToken = exports.profile = exports.Login = exports.Register = void 0;
const client_1 = __importDefault(require("../client"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendTokenResponse_helper_1 = __importDefault(require("../helpers/sendTokenResponse.helper"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        let user = yield client_1.default.user.findFirst({ where: { email } });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already registered. Please login!",
            });
        }
        const hashPass = bcryptjs_1.default.hashSync(password, 10);
        user = yield client_1.default.user.create({
            data: {
                name,
                email,
                password: hashPass,
            },
        });
        (0, sendTokenResponse_helper_1.default)(user, 200, res);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});
exports.Register = Register;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield client_1.default.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found. Please register first!",
            });
        }
        const isMatch = bcryptjs_1.default.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials. Please try again!",
            });
        }
        (0, sendTokenResponse_helper_1.default)(user, 200, res);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});
exports.Login = Login;
const profile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err });
    }
});
exports.profile = profile;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'No token, authorization denied' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secrets_1.JWT_SECRET);
        const user = yield client_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }
        (0, sendTokenResponse_helper_1.default)(user, 200, res);
    }
    catch (err) {
        res.status(401).json({ success: false, error: 'Token is not valid' });
    }
});
exports.refreshToken = refreshToken;
