import { CreditCardToken } from "../entities/CreditCardToken";

export interface CreditCardTokenRepository {
    getByToken(token: string): Promise<CreditCardToken | null>;
    create(creditCardToken: CreditCardToken): Promise<CreditCardToken>;
}