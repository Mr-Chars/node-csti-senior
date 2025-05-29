import { isValidLuhn } from "./luhn";

describe('isValidLuhn()', () => {
    it('debería ser válido', () => {
        const luhnValue = isValidLuhn("4557881313139893");
        expect(luhnValue).toBeTruthy();
    });
    it('debería ser inválido', () => {
        const luhnValue = isValidLuhn("231z4zz5");
        expect(luhnValue).toBeFalsy();
    });
});