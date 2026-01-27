import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async ({ email, password, name }: RegisterInput) => {
  if (!email || !password || !name) {
    throw new Error("Email, password, and name are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  return { id: user.id, email: user.email, name: user.name };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
};

export const logoutUser = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });

  return { message: "Logged out successfully" };
};
