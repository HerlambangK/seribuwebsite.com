// server/api/auth/oauth.ts
import { prisma } from "@/server/db";
import { generateJwt } from "~/utils/auth";
import { OAuth2Client } from "google-auth-library";
import { defineEventHandler, readBody } from "h3";
import type { User } from "~/utils/types"; // Use type-only import

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const tokenId = body.tokenId as string;

  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const email = payload?.email;

  if (!email) {
    throw createError({ statusCode: 401, message: "Invalid token" });
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        username: "", // Default or handle differently
        isVerified: true,
        passwordHash: "", // Add a placeholder or handle as needed
      },
    });
  }

  const jwtToken = generateJwt(user.id);
  return { user, accessToken: jwtToken, refreshToken: "" }; // Adjust according to your needs
});
