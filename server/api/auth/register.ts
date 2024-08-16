// server/api/auth/register.ts
import { defineEventHandler, readBody } from 'h3';
import { prisma } from '@/server/db';
import { sendVerificationEmail } from '@/utils/email';
import { z } from 'zod';
import { hashPassword, generateToken } from '@/utils/auth';
// import { guestMiddleware } from '~/server/middleware/guest';

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	username: z.string().min(3),
});

export default defineEventHandler(async (event) => {
	// guestMiddleware(event); // Ensure guest access only

	const body = await readBody(event);
	const { email, password, username } = registerSchema.parse(body);

	let user = await prisma.user.findUnique({ where: { email } });
	if (user) {
		if (!user.isVerified) {
			// Generate a new verification token if the user is not verified
			const newToken = generateToken();
			await prisma.user.update({
				where: { email },
				data: {
					verificationToken: newToken,
					verificationTokenExpiry: new Date(Date.now() + 30 * 1000), // 30 seconds
				},
			});
			await sendVerificationEmail(email, newToken);
			return { message: 'Verification email resent. Please check your email.' };
		}
		throw createError({ statusCode: 400, message: 'Email already in use' });
	}

	const token = generateToken();
	user = await prisma.user.create({
		data: {
			email,
			passwordHash: await hashPassword(password),
			username,
			verificationToken: token,
			verificationTokenExpiry: new Date(Date.now() + 30 * 1000), // 30 seconds
		},
	});

	await sendVerificationEmail(email, token);

	return {
		message:
			'Registration successful. Please check your email to verify your account.',
	};
});
