import { ProductsDatasource, type CreateOrUpdateProductPayload } from '@/features/products/products';
import { isAxiosError, type AxiosInstance } from 'axios';

export class ProductsDatasourceImpl implements ProductsDatasource {
    constructor(private api: AxiosInstance) { }

    async createProduct(payload: CreateOrUpdateProductPayload): Promise<string> {
        try {
            const url = '/products';
            const { data } = await this.api.post(url, payload);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

}