import { Request } from "express";
import prisma from "../client";
import { EMAIL_FROM, FRONTEND_URL } from "../secret";
import transporter from "./email.utils";
import cron from "node-cron";

interface User {
  email: string;
  id: string;
}

const EmailVerification = async (req: Request, user: User): Promise<void> => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpVerificationLink = `${FRONTEND_URL}/account/verify-email?otp=${otp}`;
  
  // Set expiration time (e.g., 10 minutes from now)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    await prisma.emailVerify.create({
      data: {
        userId: user.id,
        otp: otp,
        createdAt: new Date(),
        expiresAt: expiresAt, // Store the expiration time
      },
    });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: "Email Verification",
      text: `Your OTP is ${otp}. Click the link to verify your email: ${otpVerificationLink}`,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const deleteExpiredOTPs = async () => {
  const expiryTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes
  try {
    const result = await prisma.emailVerify.deleteMany({
      where: {
        expiresAt: {
          lt: expiryTime, // Use expiresAt for deletion
        },
      },
    });
    
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
};

// Run the deletion function every minute
cron.schedule("* * * * *", deleteExpiredOTPs); 

export default EmailVerification;
