export interface AddItemForm {
    product_id: string;
    total_boxes: number;
}

export interface CreateOrderPayload {
    dc_id: string;
    client_id: string;
    transportType: string;
    requiredByDate: string;
    po: string;
}