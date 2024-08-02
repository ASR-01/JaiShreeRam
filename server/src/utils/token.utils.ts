import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../secret";
import prisma from "../client";

interface User {
  id: string;
  role: "User" | "Admin";
}

const generateToken = async (user: User) => {
  const payload = { id: user.id, role: user.role };

  // Access Token
  const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "10m", // 10 min 
  });

  // Refresh Token
  const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "5d", // 5 days
  });

  const userRefreshToken = await prisma.refreshTokens.findFirst({
    where: { userId: user.id },
  });

  if (userRefreshToken) {
    await prisma.refreshTokens.delete({
      where: { id: userRefreshToken.id },
    });
  }

  await prisma.refreshTokens.create({
    data: {
      userId: user.id,
      token: refreshToken,
    },
  });

  return { accessToken, refreshToken };
};

export default generateToken;
