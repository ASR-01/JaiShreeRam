import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.utils";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../client";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import EmailVerification from "../utils/sendEmailVerificationOtp.utils";
import generateToken from "../utils/token.utils";
import { setTokenCookies } from "../utils/setTokenCookies.utils";
import jwt from "jsonwebtoken";
import { EMAIL_FROM, FRONTEND_URL, JWT_ACCESS_TOKEN_SECRET } from "../secret";
import transporter from "../utils/email.utils";

export const UserRegistration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (existingUser) {
      return next(new ErrorHandler("User already exists. Please login.", 400));
    }

    const HashPassword = bcrypt.hashSync(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: HashPassword,
      },
    });

    EmailVerification(req, user);

    res.status(201).json({
      success:true,
      message: "User registered successfully",
      user,
    });
  }
);

export const VerifyEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  // Find the user by email
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  if (user.isVerified) {
    return next(new ErrorHandler("User already verified. Please login.", 400));
  }

  // Find the OTP record for the user
  const otpRecord = await prisma.emailVerify.findFirst({
    where: { userId: user.id, otp },
  });

  // Handle case where OTP record is not found
  if (!otpRecord) {
    return next(new ErrorHandler("Invalid OTP.", 400));
  }

  // Check if the OTP has expired
  const currentTime = new Date();
  if (currentTime > otpRecord.expiresAt) {
    return next(
      new ErrorHandler("OTP has expired. Please request a new one.", 400)
    );
  }

  // Compare the provided OTP with the one stored in the OTP record
  if (otp !== otpRecord.otp) {
    return next(new ErrorHandler("Invalid OTP.", 400));
  }

  // Update the user's verification status
  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });

  // Optionally, delete the OTP record after successful verification
  await prisma.emailVerify.delete({
    where: { id: otpRecord.id },
  });

  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
});

export const RequestNewOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find the user by email
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  if (user.isVerified) {
    return next(new ErrorHandler("User already verified. Please login.", 400));
  }

  // Get the current time
  const currentTime = new Date();

  // Check for an existing OTP record
  const existingOtpRecord = await prisma.emailVerify.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }, // Get the most recent OTP record
  });

  // If an existing OTP is found
  if (existingOtpRecord) {
    // Check if the existing OTP has not expired (10 minutes)
    const tenMinutesLater = new Date(existingOtpRecord.createdAt);
    tenMinutesLater.setMinutes(tenMinutesLater.getMinutes() + 10);

    // Check if the OTP has expired
    if (currentTime < tenMinutesLater) {
      return next(
        new ErrorHandler(
          "You can only request a new OTP after the previous one has expired.",
          400
        )
      );
    }

    // Check if the user has generated OTP more than 5 times
    const otpCount = await prisma.emailVerify.count({
      where: { userId: user.id },
    });

    // If OTP count exceeds 5, check for 10-hour limit
    if (otpCount > 5) {
      const tenHoursLater = new Date(existingOtpRecord.createdAt);
      tenHoursLater.setHours(tenHoursLater.getHours() + 10);

      if (currentTime < tenHoursLater) {
        return next(
          new ErrorHandler("You can generate a new OTP after 10 hours.", 400)
        );
      }
    }
  }

  // If the previous OTP has expired or no valid OTP exists, generate a new one
  await EmailVerification(req, user);

  res.status(200).json({
    success: true,
    message: "A new OTP has been sent to your email.",
  });
});

export const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  if (!user.isVerified) {
    return next(new ErrorHandler("User Account is not verified.", 400));
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const { accessToken, refreshToken } = await generateToken(user);

  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    user,
    accessToken,
    refreshToken,
    is_auth: true,
  });
});

export const profile = asyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, user, msg: "User Profile Success" });
});

export const Logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("is_auth");

  if (!refreshToken) {
    return next(new ErrorHandler("No refresh token found.", 401));
  }

  try {
    await prisma.refreshTokens.delete({
      where: {
        token: refreshToken, // Use only the token for deletion
      },
    });
    res.status(200).json({ success: true, msg: "Logout Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, msg: "Error logging out, please try again." });
  }
});

export const ChangePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, confirm_password } = req.body;

    const userId = (req.user as User)?.id;

    if (password !== confirm_password) {
      return next(new ErrorHandler("Passwords Don't Match", 400));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      res
        .status(200)
        .json({ success: true, msg: "Password changed successfully." });
    } catch (error) {
      console.error(error);
      return next(
        new ErrorHandler("Error changing password, please try again.", 500)
      );
    }
  }
);

export const resetPasswordEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    return next(new ErrorHandler("Email doesn't exist", 400));
  }

  const secret = user.id + JWT_ACCESS_TOKEN_SECRET;
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "15m" });

  const reset_link = `${FRONTEND_URL}/account/reset-password-confirm/${user.id}/${token}`;

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject: "Password Reset Link",
    html: `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.username},</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${reset_link}">Reset Password</a>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Thank you!</p>
    `,
  });
  res.status(200).json({
    success: true,
    msg: "Reset link send Successfully to your gmail account",
  });
});


export const userPasswordReset = asyncHandler(async (req, res, next) => {
  const { password, confirm_password } = req.body;
  const { id, token } = req.params;

  const user = await prisma.user.findFirst({ where: { id } });
  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  const new_secret = user.id + JWT_ACCESS_TOKEN_SECRET;

  // Verify the token
  try {
    jwt.verify(token, new_secret);
  } catch (error) {
    // If token is expired or invalid
    return next(new ErrorHandler("Token is expired or invalid. Please request a new link.", 400));
  }

  // Check if passwords match
  if (password !== confirm_password) {
    return next(new ErrorHandler("Passwords Don't Match", 400));
  }

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Update user password in the database
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  res.status(200).json({
    success: true,
    msg: "User Password Reset Successfully. Please Login.",
  });
});


// export const getNewAccessToken = asyncHandler(async (req, res, next) => {
//   // get new AccessToken using RefreshToken
//   const { accessToken, refreshToken } = (await refreshAccessToken(
//     req,
//     res
//   )) as { accessToken: string; refreshToken: string };

//   // Set New Tokens To Cookie
//   setTokenCookies(res, accessToken, refreshToken);

//   res.status(200).json({
//     success: true,
//     msg: "Token Generated Success",
//     accessToken,
//     refreshToken,
//   });
// });
