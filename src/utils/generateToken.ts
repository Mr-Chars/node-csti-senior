import { randomBytes } from 'crypto';

export function generateToken(length = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = randomBytes(length);
    const charsLength = chars.length;

    return Array.from(bytes)
        .slice(0, length)
        .map((b) => chars[b % charsLength])
        .join('');
}