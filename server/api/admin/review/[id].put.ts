import { prisma } from "@/server/db";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const orderId = parseInt(event.context.params?.id as string);
  const body = await readBody(event);

  // Temukan order
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: { customOrder: true },
  });

  if (!order || !order.customOrder) {
    throw createError({
      statusCode: 404,
      statusMessage: "Custom order not found",
    });
  }

  // Update status menjadi Reviewed dan set harga
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "Reviewed",
      customOrder: {
        update: {
          price: body.price,
          adminNotes: body.adminNotes,
        },
      },
    },
  });

  return updatedOrder;
});
