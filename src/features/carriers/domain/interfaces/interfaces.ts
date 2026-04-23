// Created by Luis

export interface CreateCarrierPayload {
    name: string;
    shippingCost: number;
    rateUpdatedAt: string;
}

export interface UpdateCarrierPayload {
    name?: string;
    shippingCost?: number;
    rateUpdatedAt?: string;
}
