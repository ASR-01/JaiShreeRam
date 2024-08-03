import express, { Express, Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import prisma from "./client";
dotenv.config({});

const app: Express = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://adityasinghrawat.com","https://www.adityasinghrawat.com"],
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.post("/register", async (req: Request, res: Response) => {
  const { email, password, userName } = req.body;
  try {
    // Check if email already exists
    const isAlreadyPresent = await prisma.user.findFirst({ where: { email } });

    // If it does, return an error response
    if (isAlreadyPresent) {
      return res.status(400).json({
        success: false,
        message: "Email Already exists! pls login",
      });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    // If it doesn't, create a new user in the database
    const user = await prisma.user.create({
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
    } else {
      res.status(400).json({
        success: false,
        message: "User Registration failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
      message: "Internal Server error",
    });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found! Please register.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

   
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    const accessToken = jwt.sign(
      { email: email },
      process.env.ACCESS_JWT_SECRET!,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { email: email },
      process.env.REFRESH_JWT_SECRET!,
      { expiresIn: "5m" }
    );

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
    } else {
      res.status(400).json({
        success: false,
        message: "Login failed",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

const VerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    const renewed = await renewToken(req, res);
    if (!renewed) {
      return res.status(401).json({ valid: false, message: "No Refresh token" });
    }
  } else {
    jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET!, (err: any, decoded: any) => {
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
};

const renewToken = (req: Request, res: Response): Promise<boolean> => {
  return new Promise((resolve) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return resolve(false);
    }

    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return resolve(false);
      }

      const accessToken = jwt.sign({ email: decoded.email }, process.env.ACCESS_JWT_SECRET!, { expiresIn: "1m" });
      res.cookie("accessToken", accessToken, { maxAge: 60000 });
      resolve(true);
    });
  });
};


app.get("/dashboard", VerifyToken, async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Welcome to the dashboard!",
       // @ts-ignore 
      email:req.email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
      message: "Internal Server error",
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
