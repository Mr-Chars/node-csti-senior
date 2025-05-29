import { CreditCardToken } from "../entities/CreditCardToken";

export interface TokenRepository {
    save(token: string, data: CreditCardToken): Promise<void>;
    get(token: string): Promise<CreditCardToken | null>;
}