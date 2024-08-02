"use strict";
// import { NextFunction, Request, Response } from "express";
// import ErrorHandler from "../utils/errorHandler.utils";
// export const setAuthHeader = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const accessToken = req.cookies.accessToken;
//     console.log(accessToken);
//     if (!accessToken) {
//       return next(new ErrorHandler("No access token provided", 400));
//     }
// Set the Authorization header to Bearer <accessToken>
//     req.headers["authorization"] = `Bearer ${accessToken}`;
//     next();
//   } catch (error) {
// Handle any unexpected errors
//     next(
//       new ErrorHandler(
//         "An error occurred while setting the Authorization header",
//         500
//       )
//     );
//   }
// };
// //
