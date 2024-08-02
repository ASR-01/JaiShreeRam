import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import rootRouter from "./routes/index.route";
import "./helpers/passport-jwt.helper"
import cookieParser from "cookie-parser";
import passport from "passport";
import { FRONTEND_URL } from "./secret";

const app: Express = express();
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, msg: "I am Aditya Richest Man in the World" });
});

app.use("/api", rootRouter);

export default app;
