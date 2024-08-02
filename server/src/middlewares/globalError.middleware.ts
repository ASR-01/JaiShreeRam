import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.utils";

const GlobalErrorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    msg: message,
  });
};

export default GlobalErrorMiddleware;
