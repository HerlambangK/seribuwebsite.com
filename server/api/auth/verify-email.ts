// server/api/auth/verify-email.ts
import { defineEventHandler, readBody } from 'h3';
import { prisma } from '@/server/db';
import { z } from 'zod';

const verifyEmailSchema = z.object({
	token: z.string(),
});

export default defineEventHandler(async (event) => {
	// const body = await readBody(event);
	// Ambil token dari query string
	const query = getQuery(event);
	const { token } = verifyEmailSchema.parse(query);

	// const user = await prisma.user.findUnique({
	const user = await prisma.user.findFirst({
		where: { verificationToken: token },
	});

	if (!user) {
		return {
			status: 'error',
			statusCode: 400,
			message: 'Invalid verification token',
		};
	}

	// Periksa apakah verificationTokenExpiry tidak null sebelum membandingkan
	if (
		user.verificationTokenExpiry &&
		user.verificationTokenExpiry < new Date()
	) {
		await prisma.user.delete({ where: { email: user.email } });
		return {
			statusCode: 400,
			status: 'error',
			message: 'Verification token expired. Please register again.',
		};
	}

	await prisma.user.update({
		where: { id: user.id },
		data: {
			isVerified: true,
			verificationToken: null,
			verificationTokenExpiry: null,
		},
	});

	return {
		statusCode: 200,
		status: 'success',
		message: 'Email verified successfully. You can now log in.',
	};
});
