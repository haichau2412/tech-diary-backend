"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const passport_1 = __importDefault(require("passport"));
const express_1 = require("express");
const token_1 = require("../../libs/token");
const router = (0, express_1.Router)();
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const user = req.user;
    const payload = {
        userId: user === null || user === void 0 ? void 0 : user.uuid,
        name: user === null || user === void 0 ? void 0 : user.name,
    };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    res.cookie("name", user === null || user === void 0 ? void 0 : user.name, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 31536000 * 1000
    });
    res.cookie("userId", user === null || user === void 0 ? void 0 : user.uuid, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 31536000 * 1000
    });
    res.cookie("refreshToken", refreshToken.default, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: refreshToken.tokenExpiration * 1000
    });
    res.cookie("accessToken", accessToken.default, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: accessToken.tokenExpiration * 1000
    });
    res.redirect(302, process.env.UI_URL);
});
router.get('/token/validate', (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    if (accessToken) {
        try {
            const result = (0, token_1.verifyAccessToken)(accessToken);
            if (typeof result !== 'string') {
                res.status(200).json({
                    message: 'access token valid',
                    name: result.name,
                    expiredAt: result.exp
                });
                return;
            }
        }
        catch (err) {
            // no error handling
        }
    }
    if (refreshToken) {
        try {
            const result = (0, token_1.verifyRefreshToken)(refreshToken);
            if (typeof result !== 'string') {
                const accessToken = (0, token_1.generateAccessToken)({ userId: result.userId });
                res.cookie("accessToken", accessToken.default, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: accessToken.tokenExpiration * 1000
                });
                res.status(200).json({
                    message: 'access token renewed',
                    expiredAt: result.exp
                });
                return;
            }
        }
        catch (err) {
            // no error handling
        }
    }
    res.status(401).json({
        message: "Please login again"
    });
    return;
});
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        res.clearCookie('userId', {
            sameSite: 'none',
            httpOnly: true,
            secure: true
        });
        res.clearCookie('accessToken', {
            sameSite: 'none',
            httpOnly: true,
            secure: true
        });
        res.clearCookie('refreshToken', {
            sameSite: 'none',
            httpOnly: true,
            secure: true
        });
        res.clearCookie('name', {
            sameSite: 'none',
            httpOnly: true,
            secure: true
        });
        res.status(200).send('Logged out successfully');
    });
});
exports.default = router;
