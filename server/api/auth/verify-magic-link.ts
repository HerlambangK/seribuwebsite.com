// server/api/auth/verify-magic-link.ts
import { defineEventHandler, getQuery } from 'h3';
import { prisma } from '@/server/db';
import { sendLoginEmail } from '~/utils/email';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const { token } = query;

	if (!token) {
		throw createError({
			statusCode: 400,
			message: 'Token is required',
		});
	}

	// Cari user berdasarkan token
	const user = await prisma.user.findFirst({
		where: {
			magicLinkToken: token as string, // Explicitly cast to string if needed
			magicLinkExpiry: {
				gte: new Date(), // Pastikan token belum expired
			},
		},
	});

	if (!user) {
		return {
			statusCode: 400,
			status: 'error',
			message: 'Invalid or expired token',
		};
	}

	// Reset token setelah berhasil login
	await prisma.user.update({
		where: { id: user.id },
		data: {
			magicLinkToken: null,
			magicLinkExpiry: null,
		},
	});

	// Anda bisa mengatur session atau token JWT di sini
	// Misalnya menggunakan JWT:
	// const authToken = createJwtToken(user.id);
	const headers = getRequestHeaders(event);
	const userAgent = headers['user-agent'];
	let ipAddress = event.node.req.headers['x-forwarded-for'];

	if (Array.isArray(ipAddress)) {
		ipAddress = ipAddress[0]; // Ambil IP pertama jika berisi array
	}

	// Fallback ke socket address jika x-forwarded-for tidak tersedia
	ipAddress = ipAddress || event.node.req.socket?.remoteAddress;

	const magicLink = true;

	await sendLoginEmail(user.email, userAgent, ipAddress, magicLink);

	return {
		message: 'Login successful',
		user: { id: user.id, email: user.email, username: user.username },
	};
});
