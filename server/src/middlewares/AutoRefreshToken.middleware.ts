import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler.utils";
import { setTokenCookies } from "../utils/setTokenCookies.utils";
import { refreshAccessToken } from "../helpers/refreshAccessToken.helper";
 const isTokenExpired = (token: string) => {
  try {
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || typeof decoded.exp === "undefined") {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;

    // Check if the token is expired
    return currentTime >= expirationTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const autoRefreshTokens = asyncHandler(async (req, res, next) => {
  const accessTokenAcc = req.cookies.accessToken;
  const refreshTokenAcc = req.cookies.refreshToken;

  // Check if the access token is valid
  if (accessTokenAcc && !isTokenExpired(accessTokenAcc)) {
    req.headers["authorization"] = `Bearer ${accessTokenAcc}`;
    return next(); // Proceed to the next middleware
  }

  // If access token is expired or not present, check for refresh token
  if (!refreshTokenAcc) {
    return next(new ErrorHandler("Please log in", 401)); // Change to a 401 Unauthorized error
  }

  // Attempt to refresh access and refresh tokens
  try {
    const { accessToken, refreshToken } = await refreshAccessToken(req, res);

    // Ensure accessToken is defined before calling setTokenCookies
    if (accessToken && refreshToken) {
      setTokenCookies(res, accessToken, refreshToken);
      req.headers["authorization"] = `Bearer ${accessToken}`;
      return next(); // Proceed to the next middleware
    } else {
      return next(new ErrorHandler("Failed to refresh access token", 500));
    }
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return next(new ErrorHandler("Failed to refresh tokens", 500));
  }
});
