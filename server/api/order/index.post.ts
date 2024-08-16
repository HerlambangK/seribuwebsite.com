import { defineEventHandler, H3Event, readBody } from 'h3';
// import prisma from '~/server/prisma/client';
// import authMiddleware from '~/server/middleware/auth';
import { prisma } from '@/server/db';

export default defineEventHandler(async (event: H3Event) => {
	// Middleware Autentikasi
	// await authMiddleware(event);

	// Ambil userId dari context yang sudah di-autentikasi
	const userId = event.context.user.id;

	// Baca data dari request body
	const body = await readBody(event);
	const { packageId, customOrderData } = body;

	// Validasi input
	if (!packageId && !customOrderData) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Package ID or custom order data is required',
		});
	}

	// Membuat pesanan baru
	const newOrder = await prisma.order.create({
		data: {
			userId,
			packageId,
			status: 'Pending',
			totalPrice: packageId ? await calculatePackagePrice(packageId) : 0,
			customOrder: customOrderData
				? {
						create: {
							websiteType: customOrderData.websiteType,
							details: customOrderData.details,
							pageCount: customOrderData.pageCount,
							requirements: customOrderData.requirements,
							status: 'Pending',
						},
				  }
				: undefined,
		},
		include: {
			package: true,
			customOrder: true,
		},
	});

	return newOrder;
});

// Fungsi untuk menghitung harga paket
async function calculatePackagePrice(packageId: number) {
	const selectedPackage = await prisma.package.findUnique({
		where: { id: packageId },
	});

	if (!selectedPackage) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Package not found',
		});
	}

	return selectedPackage.price;
}
