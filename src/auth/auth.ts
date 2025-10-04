import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type JwtVerifyResult =
    | { expired: true }
    | { valid: true; payload: any }
    | null;

export async function verifyToken(token: string): Promise<JwtVerifyResult> {
    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ['HS512'],
        });
        return { valid: true, payload }; // Token is valid and not expired
    } catch (err: any) {
        if (err.code === 'ERR_JWT_EXPIRED') {
            // console.warn('⚠️ Token expired');
            return { expired: true };
        }

        // console.error('❌ Invalid token:', err.message);
        return null;
    }
}