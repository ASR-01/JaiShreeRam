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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = __importDefault(require("./client"));
dotenv_1.default.config({});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["https://adityasinghrawat.com", "https://www.adityasinghrawat.com"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!");
});
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userName } = req.body;
    try {
        // Check if email already exists
        const isAlreadyPresent = yield client_1.default.user.findFirst({ where: { email } });
        // If it does, return an error response
        if (isAlreadyPresent) {
            return res.status(400).json({
                success: false,
                message: "Email Already exists! pls login",
            });
        }
        // Hash the password for security
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // If it doesn't, create a new user in the database
        const user = yield client_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                userName,
            },
        });
        // Return a success response with the new user's information
        if (user) {
            res.status(200).json({
                success: true,
                message: "User Registration Successful",
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "User Registration failed",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server error",
        });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield client_1.default.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found! Please register.",
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password. Please try again.",
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ email: email }, process.env.ACCESS_JWT_SECRET, { expiresIn: "1m" });
        const refreshToken = jsonwebtoken_1.default.sign({ email: email }, process.env.REFRESH_JWT_SECRET, { expiresIn: "5m" });
        const accessCookie = res.cookie("accessToken", accessToken, {
            maxAge: 60000,
        });
        const refreshCookie = res.cookie("refreshToken", refreshToken, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        if (user) {
            res.status(200).json({
                success: true,
                message: "Login successful",
                user: { id: user.id, email: user.email, userName: user.userName },
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Login failed",
            });
        }
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
}));
const VerifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        const renewed = yield renewToken(req, res);
        if (!renewed) {
            return res.status(401).json({ valid: false, message: "No Refresh token" });
        }
    }
    else {
        jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: "Invalid Token" });
            }
            // @ts-ignore
            req.email = decoded.email;
            next();
        });
        return;
    }
    next();
});
const renewToken = (req, res) => {
    return new Promise((resolve) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return resolve(false);
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
            if (err) {
                return resolve(false);
            }
            const accessToken = jsonwebtoken_1.default.sign({ email: decoded.email }, process.env.ACCESS_JWT_SECRET, { expiresIn: "1m" });
            res.cookie("accessToken", accessToken, { maxAge: 60000 });
            resolve(true);
        });
    });
};
app.get("/dashboard", VerifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to the dashboard!",
            // @ts-ignore 
            email: req.email
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server error",
        });
    }
}));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
