// server/api/order/user-orders.get.ts
import { defineEventHandler, H3Event } from 'h3';
import { prisma } from '@/server/db';

export default defineEventHandler(async (event: H3Event) => {
	const user = event.context.user;

	if (!user) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Akses ditolak. Anda harus login untuk melihat order.',
		});
	}

	// Mengambil order berdasarkan ID pengguna yang login
	const orders = await prisma.order.findMany({
		where: {
			userId: user.id,
		},
		include: {
			package: true,
			customOrder: true,
			user: true,
		},
	});
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
	}));

	return formattedOrders;
});
