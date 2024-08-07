import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Response, Request } from "express";
import indexRouter from "./routes/index.routes";

const corsOptions = {
  origin:["http://192.168.1.7:4173","http://172.29.112.1:4173","http://localhost:4173","http://localhost:5173"],
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
