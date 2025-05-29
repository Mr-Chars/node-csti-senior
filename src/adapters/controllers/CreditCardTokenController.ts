
import { Request, Response } from 'express';
import { createCreditCardTokenSchema } from '../validators/CreateCreditCardTokenValidator';
import { CreateTokenUseCase } from '../../application/use-cases/CreateToken';
import { RedisTokenRepository } from '../../infrastructure/redis/RedisTokenRepository';

export function postToken(createTokenUseCase: CreateTokenUseCase) {
    return async (req: Request, res: Response) => {
        const validation = createCreditCardTokenSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                message: 'Datos inválidos.',
                errors: validation.error.flatten().fieldErrors,
            });
            return;
        }

        const dataForCreateToken = {
            ...validation.data,
            expiration_year: String(validation.data.expiration_year),
            expiration_month: String(validation.data.expiration_month),
            card_number: Number(validation.data.card_number),
            cvv: Number(validation.data.cvv),
        };
        const result = await createTokenUseCase.execute(dataForCreateToken);

        res.status(200).json({
            status: true,
            token: result.token,
        });
    }
}

export function getToken() {
    return async (req: Request, res: Response) => {
        const repo = new RedisTokenRepository();
        const dataFromToken = await repo.get(req.params.token);

        if (!dataFromToken) {
            res.status(404).json({
                status: false,
                message: 'Token no encontrado o expirado.'
            });
            return;
        }

        res.status(200).json({
            card_number: dataFromToken.card_number,
            expiration_month: dataFromToken.expiration_month,
            expiration_year: dataFromToken.expiration_year,
            email: dataFromToken.email,
            token: dataFromToken.token,
        });
    }
}