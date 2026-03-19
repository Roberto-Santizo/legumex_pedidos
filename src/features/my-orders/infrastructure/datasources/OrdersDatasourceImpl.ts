import { NotFoundErrorError, OrdersDatasource, OrdersResponseSchema, OrderTotalsResponseSchema, type Order, type OrderTotals } from '@/features/my-orders/my-orders';
import { isAxiosError, type AxiosInstance } from 'axios';

export class OrdersDatasourceImpl implements OrdersDatasource {

    constructor(private api: AxiosInstance) { }

    async getOrderDetails(id: string): Promise<OrderTotals> {
        try {
            const url = `/orders/getOrderTotals/${id}`;
            const { data } = await this.api.get(url);
            const response = OrderTotalsResponseSchema.safeParse(data);

            if (response.success) {
                return response.data.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if(error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

    async getOrders(): Promise<Order[]> {
        try {
            const url = '/orders';
            const { data } = await this.api.get(url);
            const response = OrdersResponseSchema.safeParse(data);

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

    async createOrder(): Promise<string> {
        try {
            const url = '/orders';
            const { data } = await this.api.post(url);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

}