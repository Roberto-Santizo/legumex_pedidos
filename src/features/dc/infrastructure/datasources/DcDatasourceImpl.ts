import { DcDatasource, DcResponseSchema, NotFoundErrorError, type CreateOrUpdateDc, type Dc } from '@/features/dc/dc';
import { isAxiosError, type AxiosInstance } from 'axios';

export class DcDatasourceImpl implements DcDatasource {

    constructor(private api: AxiosInstance) { }

    async createDc(payload: CreateOrUpdateDc): Promise<string> {
        try {
            const url = '/dcs';
            const { data } = await this.api.post(url, payload);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);

                throw new Error("Error no controlado");
            }

            throw new Error("Error no controlado");
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

            throw new Error("Información no válida");
        } catch (error) {
            throw new Error("Error no controlado");
        }
    }
}