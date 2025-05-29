import { CreditCardToken } from "../../domain/entities/CreditCardToken";
import { TokenRepository } from "../../domain/ports/TokenRepository";
import { redis } from "../../lib/redis";
const TTL = 15 * 60;
export class RedisTokenRepository implements TokenRepository {
    async save(token: string, data: CreditCardToken): Promise<void> {
        const payload = {
            ...data,
            token,
            created_at: new Date().toISOString(),
        };

        await redis.set(`form:${token}`, JSON.stringify(payload), {
            EX: TTL,
        });
    }

    async get(token: string): Promise<CreditCardToken | null> {
        const raw = await redis.get(`form:${token}`);
        if (!raw) return null;
        return JSON.parse(raw);
    }
}