export interface CreateOrUpdateProductPayload {
    name: string;
    localCode: string;
    internationalCode: string;
    price: number;
    presentation: number;
    units_per_box: number;
    boxes_per_pallet: number;
    client_id: number;
}