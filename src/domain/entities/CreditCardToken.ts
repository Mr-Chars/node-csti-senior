export class CreditCardToken {
    constructor(
        public card_number: number,
        public cvv: number,
        public expiration_month: string,
        public expiration_year: string,
        public email: string,
        public token?: string,
    ) { }
}