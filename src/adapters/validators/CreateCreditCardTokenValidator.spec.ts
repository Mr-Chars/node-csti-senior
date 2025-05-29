import { createCreditCardTokenSchema } from "./CreateCreditCardTokenValidator";

describe('createCreditCardTokenSchema', () => {
    const validData = {
        card_number: '4111111111111111',
        cvv: '123',
        expiration_month: '12',
        expiration_year: new Date().getFullYear() + 1,
        email: 'aaron@example.com',
    };

    it('debe validar datos correctos', () => {
        const result = createCreditCardTokenSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('debe rechazar tarjeta con número inválido (formato)', () => {
        const result = createCreditCardTokenSchema.safeParse({
            ...validData,
            card_number: '1234',
        });
        expect(result.success).toBe(false);
        expect(result.error?.format().card_number?._errors[0]).toContain('El número de tarjeta debe tener entre 13 y 16 dígitos');
    });

    it('debe rechazar tarjeta con número inválido (Luhn)', () => {
        const result = createCreditCardTokenSchema.safeParse({
            ...validData,
            card_number: '4111111111111112',
        });
        expect(result.success).toBe(false);
        expect(result.error?.format().card_number?._errors[0]).toContain('no es válido (Luhn)');
    });

    it('debe rechazar cvv inválido', () => {
        const result = createCreditCardTokenSchema.safeParse({
            ...validData,
            cvv: '12a',
        });
        expect(result.success).toBe(false);
        expect(result.error?.format().cvv?._errors[0]).toContain('El cvv debe tener entre 3 y 4 dígitos');
    });

    it('debe rechazar mes fuera de rango', () => {
        const result = createCreditCardTokenSchema.safeParse({
            ...validData,
            expiration_month: '13',
        });
        expect(result.success).toBe(false);
        expect(result.error?.format().expiration_month?._errors[0]).toContain('debe estar entre 1 y 12');
    });

    it('debe rechazar año menor al actual', () => {
        const result = createCreditCardTokenSchema.safeParse({
            ...validData,
            expiration_year: new Date().getFullYear() - 1,
        });
        expect(result.success).toBe(false);
        expect(result.error?.format().expiration_year?._errors[0]).toContain('igual o mayor a');
    });

    it('debe rechazar tarjeta expirada este año con mes anterior', () => {
        const now = new Date();
        const result = createCreditCardTokenSchema.safeParse({
            ...validData,
            expiration_year: now.getFullYear(),
            expiration_month: String(now.getMonth()),
        });
        expect(result.success).toBe(false);
        expect(result.error?.format().expiration_month?._errors[0]).toContain('ya está vencida');
    });

    it('debe rechazar email inválido', () => {
        const result = createCreditCardTokenSchema.safeParse({
            ...validData,
            email: 'invalid-email',
        });
        expect(result.success).toBe(false);
        expect(result.error?.format().email?._errors[0]).toContain('Debe ser un email válido');
    });
});