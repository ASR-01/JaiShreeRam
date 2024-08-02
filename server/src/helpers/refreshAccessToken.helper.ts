import { Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler.utils";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_TOKEN_SECRET } from "../secret";
import prisma from "../client";
import generateToken from "../utils/token.utils";

interface TokenDetailsType {
  id: string;
  role: "User" | "Admin";
}

interface VerifyTokenResult {
  TokenDetails?: TokenDetailsType;
  error: boolean;
  msg: string;
}

interface RefreshAccessTokenResult {
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<RefreshAccessTokenResult> => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const { TokenDetails, error } = await VerifyRefreshToken(oldRefreshToken);
    if (error || !TokenDetails) {
      return { error: "Invalid Refresh Token" };
    }

    const user = await prisma.user.findFirst({
      where: { id: TokenDetails.id },
    });

    if (!user) {
      return { error: "User Not Found" };
    }

    const userRefreshToken = await prisma.refreshTokens.findFirst({
      where: { userId: TokenDetails.id },
    });

    if (
      oldRefreshToken !== userRefreshToken?.token ||
      userRefreshToken?.blackListed
    ) {
      return { error: "Unauthorized" };
    }

    const { accessToken, refreshToken } = await generateToken(user);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ErrorHandler("Internal Server Error", 500);
  }
};

const VerifyRefreshToken = async (
  refreshToken: string
): Promise<VerifyTokenResult> => {
  try {
    const privateKey = JWT_REFRESH_TOKEN_SECRET;

    const userRefreshToken = await prisma.refreshTokens.findFirst({
      where: {
        token: refreshToken,
      },
    });

    if (!userRefreshToken) {
      return { error: true, msg: "Invalid Token" };
    }

    const TokenDetails = jwt.verify(
      refreshToken,
      privateKey
    ) as TokenDetailsType;
    console.log(TokenDetails);

    return {
      TokenDetails,
      error: false,
      msg: "Token is Valid",
    };
  } catch (error) {
    return { error: true, msg: "Invalid Token" };
  }
};
