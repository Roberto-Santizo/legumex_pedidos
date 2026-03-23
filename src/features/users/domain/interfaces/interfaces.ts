export type CreateOrUpdateUserPayload = {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    clients: string[];
}