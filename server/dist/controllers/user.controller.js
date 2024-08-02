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
exports.userPasswordReset = exports.resetPasswordEmail = exports.ChangePassword = exports.Logout = exports.profile = exports.Login = exports.RequestNewOtp = exports.VerifyEmail = exports.UserRegistration = void 0;
const errorHandler_utils_1 = __importDefault(require("../utils/errorHandler.utils"));
const asyncHandler_1 = require("../utils/asyncHandler");
const client_1 = __importDefault(require("../client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmailVerificationOtp_utils_1 = __importDefault(require("../utils/sendEmailVerificationOtp.utils"));
const token_utils_1 = __importDefault(require("../utils/token.utils"));
const setTokenCookies_utils_1 = require("../utils/setTokenCookies.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("../secret");
const email_utils_1 = __importDefault(require("../utils/email.utils"));
exports.UserRegistration = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield client_1.default.user.findUnique({
        where: {
            username: req.body.username,
        },
    });
    if (existingUser) {
        return next(new errorHandler_utils_1.default("User already exists. Please login.", 400));
    }
    const HashPassword = bcrypt_1.default.hashSync(req.body.password, 10);
    const user = yield client_1.default.user.create({
        data: Object.assign(Object.assign({}, req.body), { password: HashPassword }),
    });
    (0, sendEmailVerificationOtp_utils_1.default)(req, user);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
    });
}));
exports.VerifyEmail = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    // Find the user by email
    const user = yield client_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        return next(new errorHandler_utils_1.default("User doesn't exist", 400));
    }
    if (user.isVerified) {
        return next(new errorHandler_utils_1.default("User already verified. Please login.", 400));
    }
    // Find the OTP record for the user
    const otpRecord = yield client_1.default.emailVerify.findFirst({
        where: { userId: user.id, otp },
    });
    // Handle case where OTP record is not found
    if (!otpRecord) {
        return next(new errorHandler_utils_1.default("Invalid OTP.", 400));
    }
    // Check if the OTP has expired
    const currentTime = new Date();
    if (currentTime > otpRecord.expiresAt) {
        return next(new errorHandler_utils_1.default("OTP has expired. Please request a new one.", 400));
    }
    // Compare the provided OTP with the one stored in the OTP record
    if (otp !== otpRecord.otp) {
        return next(new errorHandler_utils_1.default("Invalid OTP.", 400));
    }
    // Update the user's verification status
    yield client_1.default.user.update({
        where: { id: user.id },
        data: { isVerified: true },
    });
    // Optionally, delete the OTP record after successful verification
    yield client_1.default.emailVerify.delete({
        where: { id: otpRecord.id },
    });
    res.status(200).json({
        success: true,
        message: "Email verified successfully.",
    });
}));
exports.RequestNewOtp = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Find the user by email
    const user = yield client_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        return next(new errorHandler_utils_1.default("User doesn't exist", 400));
    }
    if (user.isVerified) {
        return next(new errorHandler_utils_1.default("User already verified. Please login.", 400));
    }
    // Get the current time
    const currentTime = new Date();
    // Check for an existing OTP record
    const existingOtpRecord = yield client_1.default.emailVerify.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }, // Get the most recent OTP record
    });
    // If an existing OTP is found
    if (existingOtpRecord) {
        // Check if the existing OTP has not expired (10 minutes)
        const tenMinutesLater = new Date(existingOtpRecord.createdAt);
        tenMinutesLater.setMinutes(tenMinutesLater.getMinutes() + 10);
        // Check if the OTP has expired
        if (currentTime < tenMinutesLater) {
            return next(new errorHandler_utils_1.default("You can only request a new OTP after the previous one has expired.", 400));
        }
        // Check if the user has generated OTP more than 5 times
        const otpCount = yield client_1.default.emailVerify.count({
            where: { userId: user.id },
        });
        // If OTP count exceeds 5, check for 10-hour limit
        if (otpCount > 5) {
            const tenHoursLater = new Date(existingOtpRecord.createdAt);
            tenHoursLater.setHours(tenHoursLater.getHours() + 10);
            if (currentTime < tenHoursLater) {
                return next(new errorHandler_utils_1.default("You can generate a new OTP after 10 hours.", 400));
            }
        }
    }
    // If the previous OTP has expired or no valid OTP exists, generate a new one
    yield (0, sendEmailVerificationOtp_utils_1.default)(req, user);
    res.status(200).json({
        success: true,
        message: "A new OTP has been sent to your email.",
    });
}));
exports.Login = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield client_1.default.user.findFirst({
        where: { email },
    });
    if (!user) {
        return next(new errorHandler_utils_1.default("User doesn't exist", 400));
    }
    if (!user.isVerified) {
        return next(new errorHandler_utils_1.default("User Account is not verified.", 400));
    }
    const isPasswordValid = bcrypt_1.default.compareSync(password, user.password);
    if (!isPasswordValid) {
        return next(new errorHandler_utils_1.default("Invalid email or password.", 400));
    }
    const { accessToken, refreshToken } = yield (0, token_utils_1.default)(user);
    (0, setTokenCookies_utils_1.setTokenCookies)(res, accessToken, refreshToken);
    res.status(200).json({
        success: true,
        message: "Login successful.",
        user,
        accessToken,
        refreshToken,
        is_auth: true,
    });
}));
exports.profile = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(200).json({ success: true, user, msg: "User Profile Success" });
}));
exports.Logout = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("is_auth");
    if (!refreshToken) {
        return next(new errorHandler_utils_1.default("No refresh token found.", 401));
    }
    try {
        yield client_1.default.refreshTokens.delete({
            where: {
                token: refreshToken, // Use only the token for deletion
            },
        });
        res.status(200).json({ success: true, msg: "Logout Successfully" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, msg: "Error logging out, please try again." });
    }
}));
exports.ChangePassword = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password, confirm_password } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (password !== confirm_password) {
        return next(new errorHandler_utils_1.default("Passwords Don't Match", 400));
    }
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    try {
        const updatedUser = yield client_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        res
            .status(200)
            .json({ success: true, msg: "Password changed successfully." });
    }
    catch (error) {
        console.error(error);
        return next(new errorHandler_utils_1.default("Error changing password, please try again.", 500));
    }
}));
exports.resetPasswordEmail = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield client_1.default.user.findFirst({ where: { email } });
    if (!user) {
        return next(new errorHandler_utils_1.default("Email doesn't exist", 400));
    }
    const secret = user.id + secret_1.JWT_ACCESS_TOKEN_SECRET;
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn: "15m" });
    const reset_link = `${secret_1.FRONTEND_URL}/account/reset-password-confirm/${user.id}/${token}`;
    yield email_utils_1.default.sendMail({
        from: secret_1.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.username},</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${reset_link}">Reset Password</a>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Thank you!</p>
    `,
    });
    res.status(200).json({
        success: true,
        msg: "Reset link send Successfully to your gmail account",
    });
}));
exports.userPasswordReset = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirm_password } = req.body;
    const { id, token } = req.params;
    const user = yield client_1.default.user.findFirst({ where: { id } });
    if (!user) {
        return next(new errorHandler_utils_1.default("User doesn't exist", 400));
    }
    const new_secret = user.id + secret_1.JWT_ACCESS_TOKEN_SECRET;
    // Verify the token
    try {
        jsonwebtoken_1.default.verify(token, new_secret);
    }
    catch (error) {
        // If token is expired or invalid
        return next(new errorHandler_utils_1.default("Token is expired or invalid. Please request a new link.", 400));
    }
    // Check if passwords match
    if (password !== confirm_password) {
        return next(new errorHandler_utils_1.default("Passwords Don't Match", 400));
    }
    // Hash the new password
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    // Update user password in the database
    yield client_1.default.user.update({
        where: { id },
        data: { password: hashedPassword },
    });
    res.status(200).json({
        success: true,
        msg: "User Password Reset Successfully. Please Login.",
    });
}));
// export const getNewAccessToken = asyncHandler(async (req, res, next) => {
//   // get new AccessToken using RefreshToken
//   const { accessToken, refreshToken } = (await refreshAccessToken(
//     req,
//     res
//   )) as { accessToken: string; refreshToken: string };
//   // Set New Tokens To Cookie
//   setTokenCookies(res, accessToken, refreshToken);
//   res.status(200).json({
//     success: true,
//     msg: "Token Generated Success",
//     accessToken,
//     refreshToken,
//   });
// });
