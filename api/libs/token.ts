import jwt from 'jsonwebtoken'

export function generateAccessToken(payload: {
    userId: string
}) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '60s' });

    return {
        default: accessToken,
        tokenExpiration: 60
    }
}

export function generateRefreshToken(payload: {
    userId: string
}) {

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });

    return {
        default: refreshToken,
        tokenExpiration: 7 * 24 * 60 * 60
    }
}


export function verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
}