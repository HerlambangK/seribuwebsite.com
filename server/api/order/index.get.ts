// server/api/order/index.get.ts
import { prisma } from "@/server/db";
import { defineEventHandler, H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const admin = event.context.admin;

  if (!admin) {
    return {
      statusCode: 403,
      statusMessage: "Akses ditolak. Hanya admin yang dapat melihat semua order.",
    };
  }

  // Mengambil semua order
  const orders = await prisma.order.findMany({
    include: {
      package: true,
      customOrder: true,
      user: {
        select: {
          id: true,
          username: true, // Ambil informasi pengguna terkait
        },
      },
    },
  });

  // Format hasil dengan relasi
  const formattedOrders = orders.map((order) => ({
    id: order.id,
    user: order.user.username,
    package: order.package
      ? {
          name: order.package.name, // Contoh jika ada nama paket
          price: order.package.price,
        }
      : null,
    customOrder: order.customOrder
      ? {
          websiteType: order.customOrder.websiteType,
          details: order.customOrder.details,
          pageCount: order.customOrder.pageCount,
          requirements: order.customOrder.requirements,
          status: order.customOrder.status,
        }
      : null,
    status: order.status,
    totalPrice: order.totalPrice,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));

  return formattedOrders;
});
