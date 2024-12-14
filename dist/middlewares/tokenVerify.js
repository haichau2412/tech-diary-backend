"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMW = void 0;
const token_1 = require("../libs/token");
const verifyTokenMW = (req, res, next) => {
    const { userId, accessToken } = req.cookies;
    try {
        const result = (0, token_1.verifyAccessToken)(accessToken);
        if (userId && typeof result !== 'string' && userId === result.userId) {
            next();
            return;
        }
    }
    catch (err) {
        // no error handling
    }
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
};
exports.verifyTokenMW = verifyTokenMW;
