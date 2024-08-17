import { defineEventHandler, readBody } from 'h3';
import { prisma } from '@/server/db';
import {
	generateJwt,
	verifyRefreshToken,
	saveRefreshToken,
} from '@/utils/auth';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { refreshToken } = body;

	if (!refreshToken) {
		throw createError({
			statusCode: 400,
			message: 'Refresh token is required',
		});
	}

	// Verifikasi refresh token
	const payload = verifyRefreshToken(refreshToken);
	if (!payload) {
		throw createError({ statusCode: 401, message: 'Invalid refresh token' });
	}

	// Cek apakah refresh token ada di database
	const dbToken = await prisma.refreshToken.findFirst({
		where: {
			token: refreshToken,
		},
	});

	if (!dbToken) {
		throw createError({
			statusCode: 401,
			message: 'Refresh token not found in database',
		});
	}

	// Generate new tokens
	const { accessToken, refreshToken: newRefreshToken } = generateJwt(
		payload.userId,
		payload.role
	);

	// Save new refresh token to database
	await saveRefreshToken(payload.userId, payload.adminId, newRefreshToken);

	return {
		accessToken,
		refreshToken: newRefreshToken,
		message: 'Tokens refreshed successfully',
	};
});
