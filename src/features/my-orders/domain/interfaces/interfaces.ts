export interface AddItemForm {
    product_id: number;
    total_boxes: number;
    supplierStock: string;
}

export interface CreateOrderPayload {
    dc_id: number;
    client_id: number;
    transportType: string;
    requiredByDate: string;
    po: string;
    year: number;
    week: number;
}

//FILTERS
export interface OrderFilters {
    year: string;
    week: string;
    po: string;
    client: string;
    dc: string;
    transportType: string;
}