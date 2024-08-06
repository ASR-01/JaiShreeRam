import { Response } from "express";
import generateToken from "./generateTokens.helper";
import { NODE_ENV } from "../secrets";

const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const accessToken = generateToken(user.id, "15m");
  const refreshToken = generateToken(user.id, "7d");

  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: NODE_ENV === "production",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: false,
    secure: NODE_ENV === "production",
  });

  res.status(statusCode).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    },
  });
};


export default sendTokenResponse