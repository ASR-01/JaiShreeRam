"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const secret_1 = require("../secret");
const transporter = nodemailer_1.default.createTransport({
    host: secret_1.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: secret_1.EMAIL_USER,
        pass: secret_1.APP_PASSWORD,
    },
});
exports.default = transporter;
