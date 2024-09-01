import { prisma } from "@/server/db";
import { createError, defineEventHandler, useQuery } from "h3";

export default defineEventHandler(async (event) => {
  // Pastikan user sudah terautentikasi
  if (!event.context.user) {
    return {
      statusCode: 401,
      statusMessage: "Autentikasi diperlukan untuk akses ini.",
    };
  }

  // Dapatkan ID user dari parameter
  const { id } = event.context.params;

  // Validasi jika ID tidak valid
  if (!id || isNaN(Number(id))) {
    return {
      statusCode: 400,
      statusMessage: "ID user tidak valid.",
    };
  }

  // Ambil data user berdasarkan ID
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      orders: true, // Menyertakan data order jika diperlukan
      oauths: true, // Menyertakan data OAuth jika ada
    },
  });

  // Jika user tidak ditemukan
  if (!user) {
    return {
      statusCode: 404,
      statusMessage: "User tidak ditemukan.",
    };
  }

  // Format output sesuai kebutuhan Anda
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    orders: user.orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalPrice: order.totalPrice.toString(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    })),
    oauths: user.oauths.map((oauth) => ({
      provider: oauth.provider,
      providerId: oauth.providerId,
    })),
  };
});
