"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const jwt_1 = require("../../utils/jwt");
const registerUser = async ({ email, password, name }) => {
    if (!email || !password || !name) {
        throw new Error("Email, password, and name are required");
    }
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    const user = await prisma_1.default.user.create({
        data: { email, password: hashedPassword, name },
    });
    return { id: user.id, email: user.email, name: user.name };
};
exports.registerUser = registerUser;
const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id });
    const refreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id });
    await prisma_1.default.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return { accessToken, refreshToken };
};
exports.loginUser = loginUser;
const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token required");
    }
    await prisma_1.default.refreshToken.deleteMany({
        where: { token: refreshToken },
    });
    return { message: "Logged out successfully" };
};
exports.logoutUser = logoutUser;
