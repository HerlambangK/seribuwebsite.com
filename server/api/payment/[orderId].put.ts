import { defineEventHandler, readBody } from 'h3';
import { prisma } from '@/server/db';

export default defineEventHandler(async (event) => {
	const orderId = event.context.params?.orderId;
	const user = event.context.user;

	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		});
	}

	if (!orderId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid order ID',
		});
	}

	const body = await readBody(event);

	const { paymentMethod } = body;

	console.log('order id', orderId);
	// Temukan order
	const order = await prisma.order.findUnique({
		where: { id: Number(orderId) },
	});

	if (!order) {
		throw createError({ statusCode: 404, statusMessage: 'Order not found' });
	}

	// Proses pembayaran dan update status
	const payment = await prisma.payment.create({
		data: {
			orderId: order.id,
			paymentMethod,
			amount: order.totalPrice,
			status: 'success',
		},
	});

	// Update status order setelah pembayaran sukses
	const updatedOrder = await prisma.order.update({
		where: { id: order.id },
		data: {
			status: 'Ordered',
		},
	});

	return { payment, updatedOrder };
});
