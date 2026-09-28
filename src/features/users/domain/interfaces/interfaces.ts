export type CreateOrUpdateUserPayload = {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    clients: string[];
}
//FILTERS
export interface FiltersUsers {
    name: string;
    lastName: string;
    email: string;
    role: string;
}
