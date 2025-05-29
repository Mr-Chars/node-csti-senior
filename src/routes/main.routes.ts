import { Router } from 'express';
import { getToken, postToken } from '../adapters/controllers/CreditCardTokenController';
import { RedisTokenRepository } from '../infrastructure/redis/RedisTokenRepository';
import { CreateTokenUseCase } from '../application/use-cases/CreateToken';
const tokenRepository = new RedisTokenRepository();
const createTokenUseCase = new CreateTokenUseCase(tokenRepository);
const router = Router();

router.post('/generate-token', postToken(createTokenUseCase));

router.get('/:token', getToken());

export default router;