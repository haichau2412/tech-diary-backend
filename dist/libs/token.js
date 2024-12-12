"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccessToken(payload) {
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
    return {
        default: accessToken,
        tokenExpiration: 60
    };
}
function generateRefreshToken(payload) {
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return {
        default: refreshToken,
        tokenExpiration: 7 * 24 * 60 * 60
    };
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
}
