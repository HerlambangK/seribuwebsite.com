import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken() {
  return Math.random().toString(36).substr(2); // Simple token generation
}

export function generateJwt(
  userId: number,
  role: "admin" | "user"
): { accessToken: string; refreshToken: string } {
  const accessToken = jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: "15m",
  }); // Short-lived access token
  const refreshToken = jwt.sign({ userId, role }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  }); // Longer-lived refresh token
  return { accessToken, refreshToken };
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (e) {
    return null;
  }
}

// Fungsi untuk menyimpan refresh token ke database
export async function saveRefreshToken(
  userId: number | null,
  adminId: number | null,
  token: string
) {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    // Cek apakah ada token yang aktif untuk user atau admin
    const existingToken = await prisma.refreshToken.findFirst({
      where: {
        OR: [{ userId }, { adminId }],
      },
    });

    if (existingToken) {
      // Jika token sudah ada, update token
      await prisma.refreshToken.update({
        where: {
          id: existingToken.id,
        },
        data: {
          token,
          expiresAt,
        },
      });
    } else {
      // Hapus token lama yang sudah ada untuk user atau admin
      await prisma.refreshToken.deleteMany({
        where: {
          OR: [{ userId }, { adminId }],
        },
      });

      // Simpan token baru
      await prisma.refreshToken.create({
        data: {
          token,
          userId: userId !== null ? userId : undefined,
          adminId: adminId !== null ? adminId : undefined,
          expiresAt,
        },
      });
    }
  } catch (error) {
    console.error("Error saving or updating refresh token:", error);
  }
}

// Fungsi untuk menghapus refresh token dari database
export async function deleteRefreshToken(token: string) {
  try {
    await prisma.refreshToken.deleteMany({
      where: {
        token,
      },
    });
  } catch (error) {
    console.error("Error deleting refresh token:", error);
  }
}
