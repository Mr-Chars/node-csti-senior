import { z } from 'zod';
import { isValidLuhn } from '../../utils/luhn';

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

export const createCreditCardTokenSchema = z.object({
    card_number: z
        .string()
        .regex(/^\d{13,16}$/, 'El número de tarjeta debe tener entre 13 y 16 dígitos numéricos')
        .refine(isValidLuhn, {
            message: 'El número de tarjeta no es válido (Luhn)',
        }),
    cvv: z
        .string()
        .regex(/^\d{3,4}$/, 'El cvv debe tener entre 3 y 4 dígitos numéricos'),
    expiration_month: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 1 && val <= 12, {
            message: 'El mes de expiración debe estar entre 1 y 12',
        }),
    expiration_year: z
        .number({ invalid_type_error: 'El año debe ser un número' })
        .int()
        .min(currentYear, `El año debe ser igual o mayor a ${currentYear}`)
        .max(currentYear + 5, `El año no puede ser mayor a ${currentYear + 5}`),
    email: z.string().email('Debe ser un email válido'),
}).refine(
    (data) => {
        if (data.expiration_year === currentYear) {
            return data.expiration_month >= currentMonth;
        }
        return true;
    },
    {
        path: ['expiration_month'],
        message: 'La tarjeta ya está vencida',
    }
);