
import passport from "passport";
import { Router, Request, Response, NextFunction } from 'express';
import { UserDoc } from "../../models/mongo";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../libs/token";

const router = Router();

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);


router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const user = req.user as UserDoc
        const payload = {
            userId: user?.uuid,
            name: user?.name,
        };
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        res.cookie("name", user?.name, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 31536000 * 1000
        });

        res.cookie("userId", user?.uuid, {
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

        res.redirect(302, process.env.UI_URL as string);
    }
);

router.get('/token/validate', (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies

    if (accessToken) {
        try {
            const result = verifyAccessToken(accessToken)

            if (typeof result !== 'string') {
                res.status(200).json({
                    message: 'access token valid',
                    name: result.name,
                    expiredAt: result.exp
                })
                return
            }

        } catch (err: unknown) {
            // no error handling
        }

    }

    if (refreshToken) {
        try {
            const result = verifyRefreshToken(refreshToken)

            if (typeof result !== 'string') {
                const accessToken = generateAccessToken({ userId: result.userId })

                res.cookie("accessToken", accessToken.default, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: accessToken.tokenExpiration * 1000
                });

                res.status(200).json({
                    message: 'access token renewed',
                    expiredAt: result.exp
                })
                return
            }

        } catch (err: unknown) {
            // no error handling
        }
    }

    res.status(401).json({
        message: "Please login again"
    })
    return
});

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) return next(err);
        res.clearCookie('userId');
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).send('Logged out successfully');
    });
});

export default router