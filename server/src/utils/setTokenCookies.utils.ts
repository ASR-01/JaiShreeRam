import { Response } from "express";

export const setTokenCookies = async (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 60 * 1000, // 10 minutes
    sameSite: "strict",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    sameSite: "strict",
  });

  res.cookie("is_Auth", true, {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    sameSite: "strict",
  });
};
