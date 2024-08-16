// server/api/auth/login.ts
import { defineEventHandler, readBody } from 'h3';
import { prisma } from '@/server/db';
import { z } from 'zod';
import { generateJwt, verifyPassword } from '@/utils/auth';
import nodemailer from 'nodemailer';
import { sendLoginEmail } from '~/utils/email';
// import { guestMiddleware } from '~/server/middleware/guest';
// import { guestMiddleware } from '~/server/middleware/guest';

// import { generateJwt } from '@/utils/jwt';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export default defineEventHandler(async (event) => {
	// guestMiddleware(event); // Ensure guest access only

	const body = await readBody(event);
	const { email, password } = loginSchema.parse(body);

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw createError({
			statusCode: 401,
			message: 'Invalid email or password',
		});
	}

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

	const token = generateJwt(user.id);
	return { token };
});
