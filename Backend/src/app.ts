import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Response, Request } from "express";
import indexRouter from "./routes/index.routes";

const corsOptions = {
  origin: ["http://adityasinghrawat.com", "http://www.adityasinghrawat.com"],
  credentials: true, 
} 
const app: Express = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/v1", indexRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the backend");
});

export default app;
