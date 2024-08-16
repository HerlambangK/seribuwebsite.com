// server/api/auth/oauth.ts
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

	const ticket = await client.verifyIdToken({
		idToken: tokenId,
		audience: process.env.GOOGLE_CLIENT_ID,
	});
	const payload = ticket.getPayload();
	const email = payload?.email;

	if (!email) {
		throw createError({ statusCode: 401, message: 'Invalid token' });
	}

	let user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		user = await prisma.user.create({
			data: {
				email,
				isVerified: true,
			},
		});
	}

	const jwtToken = generateJwt(user.id);
	return { token: jwtToken };
});
