import { NextFunction, Request, Response } from "express";
import prisma from "../client";
import bcrypt from "bcryptjs";
import sendTokenResponse from "../helpers/sendTokenResponse.helper";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  try {
    let user = await prisma.user.findFirst({ where: { email } });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered. Please login!",
      });
    }

    const hashPass = bcrypt.hashSync(password, 10);

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPass,
      },
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please register first!",
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. Please try again!",
      });
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


export const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};



export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(refreshToken,JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};