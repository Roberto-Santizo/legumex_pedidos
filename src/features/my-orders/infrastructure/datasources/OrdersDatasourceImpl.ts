import { NotFoundErrorError, OrderConfirmedResponseSchema, OrderItemsDetailsResponseSchema, OrdersDatasource, OrdersPaginatedSchema, OrdersResponseSchema, OrderTotalsResponseSchema, type AddItemForm, type Order, type OrderConfirmed, type OrderItemDetails, type OrderTotals, type PaginatedOrders } from '@/features/my-orders/my-orders';
import { isAxiosError, type AxiosInstance } from 'axios';

export class OrdersDatasourceImpl implements OrdersDatasource {

    constructor(private api: AxiosInstance) { }

    async getPaginatedOrders(limit: number, offset: number): Promise<PaginatedOrders> {
        try {
            const url = `/orders/getPaginatedOrders?limit=${limit}&offset=${offset}`;
            const { data } = await this.api.get(url);
            const response = OrdersPaginatedSchema.safeParse(data);

            if (response.success) {
                return response.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

    async getOrderById(id: string): Promise<OrderConfirmed> {
        try {
            const url = `/orders/${id}`;
            const { data } = await this.api.get(url);
            const response = OrderConfirmedResponseSchema.safeParse(data);
            if (response.success) {
                return response.data.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

    async deleteOrderProduct(id: OrderItemDetails['id']): Promise<string> {
        try {
            const url = `/orders/deleteItem/${id}`;
            const { data } = await this.api.delete(url);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

    async getOrderProducts(id: string): Promise<OrderItemDetails[]> {
        try {
            const url = `/orders/getOrderItems/${id}`;
            const { data } = await this.api.get(url);
            const response = OrderItemsDetailsResponseSchema.safeParse(data);

            if (response.success) {
                return response.data.data;
            }

            throw new Error("Información no válida");
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

    async addItemToOrder(id: string, payload: AddItemForm): Promise<string> {
        try {
            const url = `/orders/addItem/${id}`;
            const { data } = await this.api.post(url, payload);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

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
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
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