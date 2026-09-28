export interface CreateOrUpdateDc {
    client_id: string;
    name: string;
    code: string;
    warehouse: string;
}
//FILTERS
export interface FiltersDcs {
    name: string;
    code: string;
    warehouse: string;
    client: string;
}
