import { generateToken } from "./generateToken";

describe('generateToken()', () => {
    it('debería generar un token de 16 dígitos', () => {
        const token = generateToken();
        expect(token).toHaveLength(16);
    });
    it('debería generar un token con la longitud especificada', () => {
        const token = generateToken(32);
        expect(token).toHaveLength(32);
    });
    it('debería contener solo caracteres válidos', () => {
        const token = generateToken(16);
        const regex = /^[A-Za-z0-9]+$/;
        expect(regex.test(token)).toBe(true);
    });
    it('debería generar un token diferente en cada llamada', () => {
        const token1 = generateToken();
        const token2 = generateToken();
        expect(token1).not.toBe(token2);
    });
});