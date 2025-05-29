import { CreditCardToken } from "../../domain/entities/CreditCardToken";
import { TokenRepository } from "../../domain/ports/TokenRepository";
import { generateToken } from "../../utils/generateToken";

export class CreateTokenUseCase {
    constructor(private tokenRepository: TokenRepository) { }

    async execute(data: CreditCardToken): Promise<{ token: string }> {
        const token = generateToken();
        await this.tokenRepository.save(token, data);
        return { token };
    }
}