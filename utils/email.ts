// Memuat variabel lingkungan jika diperlukan
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export async function sendVerificationEmail(email: string, token: string) {
  // Konfigurasi transporter untuk menggunakan email hosting cPanel
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Misalnya: mail.yourdomain.com
    port: parseInt(process.env.SMTP_PORT || "465"), // Port yang sesuai, misalnya: 587 atau 465
    secure: process.env.SMTP_SECURE === "true", // true untuk port 465, false untuk port 587
    auth: {
      user: process.env.SMTP_USER, // Alamat email Anda
      pass: process.env.SMTP_PASS, // Password email Anda
    },
    // logger: true, // Aktifkan logging
    // debug: true, // Aktifkan debugging
  });

  // URL verifikasi dengan token
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Register Seribuweibsite" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Email Verification Seribuwebsite.com",
    html: `
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>You Must Click This Link Once, and less than 30 Seconds.</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    // text: `Please verify your email using the following token: ${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

export async function sendLoginEmail(
  email: string,
  userAgent: string | undefined,
  ipAddress: string | undefined,
  magicLink: boolean
) {
  // Konfigurasi transporter untuk menggunakan email hosting cPanel
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Misalnya: mail.yourdomain.com
    port: parseInt(process.env.SMTP_PORT || "465"), // Port yang sesuai, misalnya: 587 atau 465
    secure: process.env.SMTP_SECURE === "true", // true untuk port 465, false untuk port 587
    auth: {
      user: process.env.SMTP_USER, // Alamat email Anda
      pass: process.env.SMTP_PASS, // Password email Anda
    },
    // logger: true, // Aktifkan logging
    // debug: true, // Aktifkan debugging
  });

  const mailOptions = {
    from: `"Login Seribuwebsite" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "New Login Detected",
    html: ` <p>A new login to your account was detected with ${
      magicLink ? "<b>Magic link</b>" : "<b>Password</b>"
    } .</p>
		  <p>Device: ${userAgent}</p> 
		  <p>IP Address: ${ipAddress} </p> 
		  <p>If this was not you, please secure your account immediately. </p>`,

    // text: `Please verify your email using the following token: ${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
