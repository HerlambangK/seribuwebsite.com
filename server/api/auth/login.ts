// server/api/auth/login.ts
import { defineEventHandler, readBody, getRequestHeaders } from 'h3';
import { prisma } from '@/server/db';
import { z } from 'zod';
import { generateJwt, verifyPassword, saveRefreshToken } from '@/utils/auth';
import { sendLoginEmail } from '~/utils/email';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, password } = loginSchema.parse(body);

	// Cek apakah email terkait dengan admin
	const admin = await prisma.admin.findUnique({ where: { email } });
	if (admin) {
		if (!(await verifyPassword(password, admin.password))) {
			throw createError({
				statusCode: 401,
				message: 'Invalid email or password',
			});
		}
		// Generate JWT for admin
		const { accessToken, refreshToken } = generateJwt(admin.id, 'admin');

		// Save refresh token to the database
		await saveRefreshToken(null, admin.id, refreshToken);

		return {
			accessToken,
			refreshToken,
			role: 'admin',
			message: 'Admin logged in successfully',
		};
	}

	// Cek apakah email terkait dengan user biasa
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || !(await verifyPassword(password, user.passwordHash))) {
		throw createError({
			statusCode: 401,
			message: 'Invalid email or password',
		});
	}

	if (!user.isVerified) {
		throw createError({ statusCode: 403, message: 'Email not verified' });
	}

	// Ambil informasi user agent dan IP address
	const headers = getRequestHeaders(event);
	const userAgent = headers['user-agent'];
	let ipAddress = event.node.req.headers['x-forwarded-for'];

	if (Array.isArray(ipAddress)) {
		ipAddress = ipAddress[0]; // Ambil IP pertama jika berisi array
	}

	// Fallback ke socket address jika x-forwarded-for tidak tersedia
	ipAddress = ipAddress || event.node.req.socket?.remoteAddress;
	const magicLink = false;

	await sendLoginEmail(user.email, userAgent, ipAddress, magicLink);

	// Generate JWT for user
	const { accessToken, refreshToken } = generateJwt(user.id, 'user');

	// Save refresh token to the database
	await saveRefreshToken(user.id, null, refreshToken);

	return {
		accessToken,
		refreshToken,
		role: 'user',
		message: 'User logged in successfully',
	};
});
