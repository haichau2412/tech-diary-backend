import { verifyAccessToken } from "../libs/token";
import { Request, Response, NextFunction } from "express";

export const verifyTokenMW = (req: Request, res: Response, next: NextFunction) => {
    const { userId, accessToken } = req.cookies
    try {
        const result = verifyAccessToken(accessToken)
        if (userId && typeof result !== 'string' && userId === result.userId) {
            next()
            return
        }
    } catch (err: unknown) {
        // no error handling
    }
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return
}