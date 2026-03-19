export interface Product {
    id: number;
    name: string;
    localCode: string;
    internationalCode: string;
    presetation: number;
    price: number;
}

export interface CreateOrUpdateProductPayload {
    name: string;
    localCode: string;
    internationalCode: string;
    price: number;
    presentation: number;
}