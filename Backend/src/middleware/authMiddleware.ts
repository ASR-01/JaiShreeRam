import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import generateToken from "../helpers/generateTokens.helper";
import { JWT_SECRET } from "../secrets";
import prisma from "../client";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ success: false, error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError && refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET!) as any;
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });

        if (!user) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid token" });
        }

        accessToken = generateToken(user.id, "15m");
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        req.user = user;
        next();
      } catch (refreshErr) {
        res.status(401).json({ success: false, error: "Token is not valid" });
      }
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, error: "Token is not valid" });
    } else {
      res.status(401).json({ success: false, error: "Authorization error" });
    }
  }
};


export default protect