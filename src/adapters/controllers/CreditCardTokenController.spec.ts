import request from 'supertest';
import express from 'express';
import { getToken, postToken } from './CreditCardTokenController';

const mockGet = jest.fn();
const mockUseCase = {
    execute: jest.fn(),
};

jest.mock('../../infrastructure/redis/RedisTokenRepository.ts', () => {
    return {
        RedisTokenRepository: jest.fn().mockImplementation(() => ({
            get: (...args: any[]) => mockGet(...args),
            save: (...args: any[]) => mockGet(...args),
        })),
    };
});

describe('CreditCardTokenController', () => {
    const app = express();
    app.use(express.json());
    app.get('/:token', getToken());
    app.post('/', postToken(mockUseCase as any));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET: debería retornar 404 si el token no existe', async () => {
        mockGet.mockResolvedValue(null);

        const res = await request(app).get('/fake-token');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            status: false,
            message: 'Token no encontrado o expirado.',
        });
    });

    it('GET: debería retornar los datos si el token existe', async () => {
        const fakeData = {
            card_number: 4557881313139893,
            expiration_month: '12',
            expiration_year: '2028',
            email: 'aaron@example.com',
            token: '184Zf8vZHrYRTRUV',
        };

        mockGet.mockResolvedValue(fakeData);

        const res = await request(app).get('/184Zf8vZHrYRTRUV');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(fakeData);
    });

    it('POST: debería retornar 200 con token si los datos son válidos', async () => {
        mockUseCase.execute.mockResolvedValue({ token: 'TOKEN123' });

        const res = await request(app).post('/').send({
            card_number: "4557881313139893",
            cvv: "1456",
            expiration_month: "06",
            expiration_year: 2025,
            email: "aaronros@gmail.com"
        });

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            card_number: 4557881313139893,
            cvv: 1456,
            expiration_month: '6',
            expiration_year: '2025',
            email: 'aaronros@gmail.com',
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            status: true,
            token: 'TOKEN123',
        });

    });

    it('POST: debería retornar 400 si los datos son inválidos', async () => {
        const res = await request(app).post('/').send({
            card_number: '',
            expiration_month: 12,
            expiration_year: 2028,
            cvv: '123',
            email: 'bademail',
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Datos inválidos.');
    });
});