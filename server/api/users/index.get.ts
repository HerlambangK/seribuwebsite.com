import { prisma } from "@/server/db";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  // Pastikan user sudah terautentikasi
  if (!event.context.user) {
    return {
      statusCode: 401,
      statusMessage: "Autentikasi diperlukan untuk akses ini.",
    };
  }

  // Ambil semua user dari database
  const users = await prisma.user.findMany({
    include: {
      orders: true, // Menyertakan data order jika diperlukan
    },
  });

  // Format output sesuai kebutuhan Anda
  const formattedUsers = users.map((user) => ({
    id: user.id,
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return formattedUsers;
});
