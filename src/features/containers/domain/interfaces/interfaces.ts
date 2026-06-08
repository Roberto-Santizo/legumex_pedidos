

export interface CreateContainerPayload {
    transportType: string;
    weekStart: string;
    orderIds?: number[];
}

export interface AddOrdersPayload {
    orderIds: number[];
}
