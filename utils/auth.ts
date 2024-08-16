import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string) {
	return bcrypt.hash(password, 12);
}

export async function verifyPassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword);
}

export function generateToken() {
	return Math.random().toString(36).substr(2); // Simple token generation
}

export function generateJwt(userId: number): string {
	return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}
