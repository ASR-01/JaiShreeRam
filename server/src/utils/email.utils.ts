import nodemailer from "nodemailer";
import path from "path";
import { APP_PASSWORD, EMAIL_HOST, EMAIL_USER } from "../secret";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: APP_PASSWORD,
  },
});

export default transporter;




