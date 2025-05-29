
import { CreditCardToken } from '../../domain/entities/CreditCardToken';
import * as tokenUtil from '../../utils/generateToken';
import { CreateTokenUseCase } from './CreateToken';
describe('CreditCardTokenService', () => {
    const mockSave = jest.fn();
    const mockRepository = { save: mockSave, get: mockSave };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería generar un token, guardar los datos y retornar el token', async () => {
        const tokenForProove = 'FAKETOKEN123';
        jest.spyOn(tokenUtil, 'generateToken').mockReturnValue(tokenForProove);

        const service = new CreateTokenUseCase(mockRepository);
        const input: CreditCardToken = {
            card_number: 4111111111111111,
            expiration_month: '12',
            expiration_year: 'aaron@gmail.com',
            email: '2028',
            cvv: 123,
        };

        const result = await service.execute(input);

        expect(tokenUtil.generateToken).toHaveBeenCalled();
        expect(mockSave).toHaveBeenCalledWith(tokenForProove, input);
        expect(result).toEqual({ token: tokenForProove });
    });
});