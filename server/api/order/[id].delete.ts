import { defineEventHandler } from 'h3';
import { prisma } from '@/server/db';

export default defineEventHandler(async (event) => {
	const orderId = parseInt(event.context.params?.id as string);

	// Temukan order
	const order = await prisma.order.findUnique({
		where: { id: Number(orderId) },
	});

	if (!order) {
		throw createError({ statusCode: 404, statusMessage: 'Order not found' });
	}

	// Cek apakah status payment sudah success
	const payment = await prisma.payment.findUnique({
		where: { orderId: order.id },
	});

	if (payment?.status === 'success' || payment?.status === 'payed') {
		throw createError({
			statusCode: 403,
			statusMessage: 'Order cannot be deleted after payment is completed',
		});
	}

	// Hapus order
	await prisma.order.delete({
		where: { id: order.id },
	});

	return { message: 'Order deleted successfully' };
});
