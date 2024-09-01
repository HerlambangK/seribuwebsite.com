// server/api/auth/request-magic-link.ts
import { randomBytes } from "crypto";
import { prisma } from "@/server/db";
import { defineEventHandler, readBody } from "h3";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      statusCode: 404,
      message: "Email not found",
    };
  }

  // Generate a unique token
  const token = randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

  // Check if user already has a magic link token
  const existingToken = user.magicLinkExpiry;

  if (existingToken && existingToken > new Date()) {
    const timeRemaining = Math.ceil((existingToken.getTime() - Date.now()) / (1000 * 60));

    return {
      statusCode: 400,
      message: `Magic link already sent.  Silahkan coba lagi dalam ${timeRemaining} menit.`,
    };
  }

  // Save token and expiry to user record
  await prisma.user.update({
    where: { email },
    data: {
      magicLinkToken: token,
      magicLinkExpiry: expiry,
    },
  });

  // Generate the magic link
  const magicLink = `http://localhost:3000/api/auth/verify-magic-link?token=${token}`;

  // Send the email with the magic link
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Misalnya: mail.yourdomain.com
    port: parseInt(process.env.SMTP_PORT || "465"), // Port yang sesuai, misalnya: 587 atau 465
    secure: process.env.SMTP_SECURE === "true", // true untuk port 465, false untuk port 587
    auth: {
      user: process.env.SMTP_USER, // Alamat email Anda
      pass: process.env.SMTP_PASS, // Password email Anda
    },
  });

  await transporter.sendMail({
    from: `"Magic Link" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Your Magic Link for Login",
    text: `Click the link below to log in:\n\n${magicLink}\n\nThis link will expire in ${Math.ceil(
      (expiry.getTime() - Date.now()) / (1000 * 60)
    )} menit atau ${Math.ceil((expiry.getTime() - Date.now()) / 1000)} detik.`,
  });

  return { message: "Magic link sent to your email." };
});
