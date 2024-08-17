// server/api/auth/register.ts
import { defineEventHandler, readBody } from 'h3';
import { prisma } from '@/server/db';
import { sendVerificationEmail } from '@/utils/email';
import { z } from 'zod';
import { hashPassword, generateToken } from '@/utils/auth';

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	username: z.string().min(3),
	isAdmin: z.boolean().optional(), // Tambahkan opsi untuk admin
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, password, username, isAdmin } = registerSchema.parse(body);

	// Periksa apakah email sudah terdaftar di tabel User atau Admin
	let existingUser = await prisma.user.findUnique({ where: { email } });
	let existingAdmin = await prisma.admin.findUnique({ where: { email } });

	if (existingUser) {
		// Cek apakah waktu token masih berlaku
		const tokenExpiry = existingUser.verificationTokenExpiry;

		if (tokenExpiry && tokenExpiry > new Date()) {
			// Jika token masih berlaku, berikan pesan bahwa harus menunggu hingga token kadaluarsa
			throw createError({
				statusCode: 400,
				message: `Email sudah terdaftar, silakan coba lagi dalam ${Math.ceil(
					(tokenExpiry.getTime() - Date.now()) / 1000
				)} detik.`,
			});
		}

		// Generate a new verification token if the user is not verified
		const newToken = generateToken();
		await prisma.user.update({
			where: { email },
			data: {
				verificationToken: newToken,
				verificationTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
			},
		});
		await sendVerificationEmail(email, newToken);
		return { message: 'Verification email resent. Please check your email.' };
	}

	if (existingAdmin) {
		throw createError({ statusCode: 400, message: 'Email already in use' });
	}

	const token = generateToken();

	if (isAdmin) {
		// Register sebagai Admin
		const admin = await prisma.admin.create({
			data: {
				email,
				username,
				password: await hashPassword(password),
			},
		});

		return {
			message: 'Admin registered successfully',
			admin: {
				id: admin.id,
				email: admin.email,
				username: admin.username,
			},
		};
	} else {
		// Register sebagai User
		const user = await prisma.user.create({
			data: {
				email,
				passwordHash: await hashPassword(password),
				username,
				verificationToken: token,
				verificationTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
			},
		});

		await sendVerificationEmail(email, token);

		return {
			message:
				'Registration successful. Please check your email to verify your account.',
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
		};
	}
});
