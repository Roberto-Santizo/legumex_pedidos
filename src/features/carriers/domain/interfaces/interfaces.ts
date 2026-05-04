// Created by Luis

export interface CreateCarrierPayload {
    name: string;
    shippingCost: number;
    rateUpdatedAt: string;
    dcId: number;
}

export interface UpdateCarrierPayload {
    name?: string;
    shippingCost?: number;
    rateUpdatedAt?: string;
    dcId?: number;
}
