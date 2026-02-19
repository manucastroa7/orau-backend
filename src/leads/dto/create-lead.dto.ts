export class CreateLeadDto {
    name: string;
    email: string;
    message: string;
    productName?: string;
    productId?: string;
    status?: string;
    phone?: string;
}
