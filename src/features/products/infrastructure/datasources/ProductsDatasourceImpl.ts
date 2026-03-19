import { ProductsDatasource, type CreateOrUpdateProductPayload, type Product, ProductsResponseSchema, ProductSchema, NotFoundError, ConflictError } from '@/features/products/products';
import { isAxiosError, type AxiosInstance } from 'axios';

export class ProductsDatasourceImpl implements ProductsDatasource {
    constructor(private api: AxiosInstance) { }

    async updateProductById(id: string, payload: CreateOrUpdateProductPayload): Promise<string> {
        try {
            const url = `/products/${id}`;
            const { data } = await this.api.patch(url, payload);

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

    async getProductById(id: string): Promise<Product> {
        try {
            const url = `/products/${id}`;
            const { data } = await this.api.get(url);
            const response = ProductSchema.safeParse(data['data']);
            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundError("El producto no esta disponible :(");
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

    async getProducts(): Promise<Product[]> {
        try {
            const url = '/products';
            const { data } = await this.api.get(url);
            const response = ProductsResponseSchema.safeParse(data);
            if (response.success) {
                return response.data.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data['message']);
            }
            throw new Error("Error no controlado");
        }
    }

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