export interface AddItemForm {
    product_id: string;
    total_boxes: number;
    po: string;
}

export interface CreateOrderPayload {
    dc: string;
    client_id: string;
    transportType: string;
    requiredByDate: string;
}