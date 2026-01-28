"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signAccessToken = (payload) => jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
});
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
});
exports.signRefreshToken = signRefreshToken;
