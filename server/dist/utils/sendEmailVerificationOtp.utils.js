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
const client_1 = __importDefault(require("../client"));
const secret_1 = require("../secret");
const email_utils_1 = __importDefault(require("./email.utils"));
const node_cron_1 = __importDefault(require("node-cron"));
const EmailVerification = (req, user) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpVerificationLink = `${secret_1.FRONTEND_URL}/account/verify-email?otp=${otp}`;
    // Set expiration time (e.g., 10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    try {
        yield client_1.default.emailVerify.create({
            data: {
                userId: user.id,
                otp: otp,
                createdAt: new Date(),
                expiresAt: expiresAt, // Store the expiration time
            },
        });
        yield email_utils_1.default.sendMail({
            from: secret_1.EMAIL_FROM,
            to: user.email,
            subject: "Email Verification",
            text: `Your OTP is ${otp}. Click the link to verify your email: ${otpVerificationLink}`,
        });
    }
    catch (error) {
        console.error("Error sending verification email:", error);
    }
});
const deleteExpiredOTPs = () => __awaiter(void 0, void 0, void 0, function* () {
    const expiryTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes
    try {
        const result = yield client_1.default.emailVerify.deleteMany({
            where: {
                expiresAt: {
                    lt: expiryTime, // Use expiresAt for deletion
                },
            },
        });
    }
    catch (error) {
        console.error("Error deleting expired OTPs:", error);
    }
});
// Run the deletion function every minute
node_cron_1.default.schedule("* * * * *", deleteExpiredOTPs);
exports.default = EmailVerification;
