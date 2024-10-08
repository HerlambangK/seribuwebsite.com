// server/api/order/[id].put.ts
import { defineEventHandler, readBody } from 'h3';
import { prisma } from '@/server/db';

export default defineEventHandler(async (event) => {
	const user = event.context.user;
	const admin = event.context.admin; // Ambil admin dari konteks

	// Verifikasi apakah user login
	// if (!user) {
	// 	throw createError({
	// 		statusCode: 401,
	// 		statusMessage: 'Unauthorized',
	// 	});
	// }

	// Ambil ID dari path parameter
	const orderId = parseInt(event.context.params?.id as string);

	if (isNaN(orderId)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid order ID',
		});
	}

	const body = await readBody(event);
	const { packageId } = body;

	// Temukan pesanan
	const order = await prisma.order.findUnique({
		where: { id: orderId },
	});

	if (!order) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Order not found',
		});
	}

	// Cek apakah status payment sudah success
	const payment = await prisma.payment.findUnique({
		where: { orderId: order.id },
	});

	// Cek apakah status sudah Reviewed
	if (order.status === 'Reviewed') {
		throw createError({
			statusCode: 403,
			statusMessage: 'Custom order cannot be updated after being reviewed',
		});
	}

	if (payment?.status === 'success' || payment?.status === 'paid') {
		throw createError({
			statusCode: 403,
			statusMessage: 'Order cannot be updated after payment is completed',
		});
	}

	// Cek apakah user adalah admin jika adminId tersedia
	if (admin) {
		// Verifikasi bahwa admin melakukan pembaruan
		const updatedOrder = await prisma.order.update({
			where: { id: orderId },
			data: {
				packageId,
				status: 'Ordered', // Atur status ke 'Ordered'
			},
		});

		// Catat admin yang melakukan pembaruan pada pengguna terkait
		await prisma.user.update({
			where: { id: order.userId },
			data: {
				updatedByAdminId: admin.id, // Catat admin yang memperbarui
			},
		});

		return { updatedOrder };
	} else {
		// Pastikan user yang login memiliki akses untuk memperbarui
		if (order.userId !== user.id) {
			throw createError({
				statusCode: 403,
				statusMessage: 'You are not allowed to update this order',
			});
		}

		const updatedOrder = await prisma.order.update({
			where: { id: orderId },
			data: {
				packageId,
			},
		});

		return { updatedOrder };
	}
});
