import { defineEventHandler, readBody } from 'h3';
import { prisma } from '@/server/db';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { generateJwt } from '~/utils/auth';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const oauthSchema = z.object({
	tokenId: z.string(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { tokenId } = oauthSchema.parse(body);

	// Verifikasi token yang diberikan oleh Google
	const ticket = await client.verifyIdToken({
		idToken: tokenId,
		audience: process.env.GOOGLE_CLIENT_ID,
	});

	const payload = ticket.getPayload();
	const email = payload?.email;
	const username = payload?.name || 'Anonymous'; // Nilai default 'Anonymous'

	if (!email) {
		throw createError({ statusCode: 401, message: 'Invalid token' });
	}

	// Cek apakah pengguna sudah terdaftar
	let user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		// Jika belum terdaftar, buat akun baru
		user = await prisma.user.create({
			data: {
				email,
				username, // Set nama pengguna dari profil Google
				isVerified: true, // Verifikasi otomatis
			},
		});
	}

	// Generate JWT untuk pengguna
	const jwtToken = generateJwt(user.id, 'user');
	return {
		token: jwtToken,
		role: 'user',
		message: 'Login with Gmail successful',
	};
});
