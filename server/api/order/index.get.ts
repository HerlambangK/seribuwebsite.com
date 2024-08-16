import { defineEventHandler } from 'h3';
import { prisma } from '@/server/db';

export default defineEventHandler(async (event) => {
	try {
		// Ambil semua data order beserta relasi user dan package
		const orders = await prisma.order.findMany({
			include: {
				user: true, // Untuk mendapatkan data user
				package: true, // Untuk mendapatkan data package
			},
		});

		// Format output sesuai kebutuhan Anda
		const formattedOrders = orders.map((order) => ({
			id: order.id,
			userName: order.user?.username, // Mengambil nama user dari relasi
			packageName: order.package?.name, // Mengambil nama package dari relasi
			status: order.status,
			totalPrice: order.totalPrice.toString(), // Konversi ke string
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
		}));
		return { statusCode: 200, body: formattedOrders };
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error' }),
		};
	}
});
