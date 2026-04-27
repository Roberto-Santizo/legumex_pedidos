import { isAxiosError, type AxiosInstance } from 'axios';
import { ClientDatasource, ClientSchema, ClientsResponseSchema, type Client } from '../../domain/domain';
import { ConflictError, NotFoundError } from '@/features/clients/clients';

export class ClientDatasourceImpl implements ClientDatasource {

    constructor(private api: AxiosInstance) { }

    async getUserClients(): Promise<Client[]> {
        try {
            const url = `/clients/getUserClients`;
            const { data } = await this.api.get(url);
            const response = ClientsResponseSchema.safeParse(data);

            console.log(response);

            if (response.success) {
                return response.data.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 409) throw new ConflictError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

    async createClient(name: string, code: string): Promise<string> {
        try {
            const url = `/clients`;
            const { data } = await this.api.post(url, { name, code });

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 409) throw new ConflictError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

    async getClients(): Promise<Client[]> {
        try {
            const url = `/clients`;
            const { data } = await this.api.get(url);
            const response = ClientsResponseSchema.safeParse(data);

            if (response.success) {
                return response.data.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 409) throw new ConflictError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

    async getClientById(id: string): Promise<Client> {
        try {
            const url = `/clients/${id}`;
            const { data } = await this.api.get(url);
            const response = ClientSchema.safeParse(data['data']);

            if (response.success) {
                return response.data
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundError(error.response.data['message']);
                if (error.response?.data['statusCode'] == 409) throw new ConflictError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

    async updateClientById({ id, name }: { id: string; name: string; }): Promise<string> {
        try {
            const url = `/clients/${id}`;
            const { data } = await this.api.patch(url, { name });

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundError(error.response.data['message']);
                if (error.response?.data['statusCode'] == 409) throw new ConflictError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }
}