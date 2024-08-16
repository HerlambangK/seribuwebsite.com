// server/middleware/auth.ts
import { defineEventHandler, getHeader, H3Event } from 'h3';
import jwt from 'jsonwebtoken';
import { prisma } from '@/server/db';

const authMiddleware = defineEventHandler(async (event: H3Event) => {
	// Tentukan rute yang tidak memerlukan autentikasi (login, register)
	const publicRoutes = ['/api/auth/login', '/api/auth/register'];

	// Jika rute adalah rute publik, lewati middleware
	const url = event.node.req.url;

	// Skip middleware for public routes
	if (url && publicRoutes.includes(url)) {
		return;
	}

	// Ambil token dari header Authorization
	const token = getHeader(event, 'authorization')?.split(' ')[1];

	if (!token) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Token tidak ditemukan, autentikasi diperlukan.',
		});
	}

	try {
		// Verifikasi token menggunakan secret key
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || 'your-secret-key'
		);

		// Cari user berdasarkan ID dari token yang didekodekan
		const user = await prisma.user.findUnique({
			where: {
				id: decoded.userId,
			},
		});

		if (!user) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Pengguna tidak ditemukan.',
			});
		}

		// Tambahkan informasi user ke context
		event.context.user = user;
	} catch (error) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Token tidak valid atau sudah kadaluarsa.',
		});
	}
});

export default authMiddleware;
