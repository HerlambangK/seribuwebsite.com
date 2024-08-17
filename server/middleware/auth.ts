// server/middleware/auth.ts
import { prisma } from "@/server/db";
import { defineEventHandler, getHeader, H3Event } from "h3";
import jwt from "jsonwebtoken";

const authMiddleware = defineEventHandler(async (event: H3Event) => {
  // Rute publik yang tidak memerlukan autentikasi
  const publicRoutes = [
    "/",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/verify-email",
    "/api/auth/request-magic-link",
  ];

  const url = event.node.req.url;

  // Lewati middleware untuk rute publik
  if (url && publicRoutes.some((route) => url.startsWith(route))) {
    return;
  }

  // Ambil token dari header Authorization
  const token = getHeader(event, "authorization")?.split(" ")[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token tidak ditemukan, autentikasi diperlukan.",
    });
  }

  try {
    // Verifikasi token menggunakan secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
      userId: number;
      role: string;
    };

    // Cari user atau admin berdasarkan ID dari token yang didekodekan
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    const admin = await prisma.admin.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user && !admin) {
      throw createError({
        statusCode: 401,
        statusMessage: "Pengguna tidak ditemukan.",
      });
    }

    // Tambahkan informasi user ke context
    if (user) {
      event.context.user = user;
    }

    // Tambahkan informasi admin ke context jika pengguna adalah admin
    if (admin) {
      event.context.admin = admin;
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token tidak valid atau sudah kadaluarsa.",
    });
  }
});

export default authMiddleware;
