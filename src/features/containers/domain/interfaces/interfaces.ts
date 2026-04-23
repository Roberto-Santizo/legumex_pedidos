// Created by Luis

// Input payloads sent to the API

export interface CreateContainerPayload {
    transportType: string;
    dc: string;
    weekStart: string;
    orderIds?: number[];
}

export interface AddOrdersPayload {
    orderIds: number[];
}
