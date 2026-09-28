import { DcDatasource, DcResponseSchema, NotFoundErrorError, PaginatedDcsResponseSchema, type CreateOrUpdateDc, type Dc, type FiltersDcs, type PaginatedDcs } from '@/features/dc/dc';
import { isAxiosError, type AxiosInstance } from 'axios';

export class DcDatasourceImpl implements DcDatasource {

    constructor(private api: AxiosInstance) { }

    async createDc(payload: CreateOrUpdateDc): Promise<string> {
        try {
            const url = '/dcs';
            const { data } = await this.api.post(url, payload);
            console.log(data);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                console.log('[createDc] status:', error.response?.status);
                console.log('[createDc] body:', error.response?.data);
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);

                throw new Error("Unhandled error");
            }

            throw new Error("Unhandled error");
        }
    }

    async getDcs(client_id: string): Promise<Dc[]> {
        try {
            const url = `/dcs?client_id=${client_id}`;
            const { data } = await this.api(url);
            const response = DcResponseSchema.safeParse(data);

            if (response.success) {
                return response.data.data;
            }

            throw new Error("Invalid data");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error("Unhandled error");
            }
            throw error instanceof Error ? error : new Error("Error no controlado");
        }
    }

    async getAllDcs(): Promise<Dc[]> {
        try {
            const { data } = await this.api('/dcs');
            const response = DcResponseSchema.safeParse(data);

            if (response.success) {
                return response.data.data;
            }

            throw new Error("Invalid data");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error("Unhandled error");
            }
            throw error instanceof Error ? error : new Error("Error no controlado");
        }
    }

    async getPaginatedDcs({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersDcs }): Promise<PaginatedDcs> {
        try {
            const params = new URLSearchParams({ limit: String(limit), offset: String(offset), ...filters });
            const url = `/dcs/getPaginatedDcs?${params}`;
            const { data } = await this.api.get(url);
            const response = PaginatedDcsResponseSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Invalid data");
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data['message']);
            }
            throw error instanceof Error ? error : new Error("Error no controlado");
        }
    }
}
