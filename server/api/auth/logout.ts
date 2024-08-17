import { defineEventHandler, getCookie, setCookie } from 'h3';
import { deleteRefreshToken } from '@/utils/auth';

export default defineEventHandler(async (event) => {
	try {
		// Ambil refresh token dari cookie
		const refreshToken = getCookie(event, 'refreshToken');
		if (!refreshToken) {
			throw createError({ statusCode: 401, message: 'No refresh token found' });
		}

		// Hapus refresh token dari database
		await deleteRefreshToken(refreshToken);

		// Hapus cookies
		setCookie(event, 'accessToken', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			expires: new Date(0),
		});

		setCookie(event, 'refreshToken', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			expires: new Date(0),
		});

		return { message: 'Successfully logged out' };
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			message: 'Logout failed: ' + (error.message || 'Unknown error'),
		});
	}
});
