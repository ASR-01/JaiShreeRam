import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const APP_PASSWORD = process.env.APP_PASSWORD!;
export const EMAIL_HOST = process.env.EMAIL_HOST!;
export const EMAIL_USER = process.env.EMAIL_USER!;
export const EMAIL_FROM = process.env.EMAIL_FROM!;
export const FRONTEND_URL=process.env.FRONTEND_HOST!;
export const JWT_ACCESS_TOKEN_SECRET=  process.env.JWT_ACCESS_TOKEN_SECRET!;
export const JWT_REFRESH_TOKEN_SECRET=  process.env.JWT_REFRESH_TOKEN_SECRET!;
