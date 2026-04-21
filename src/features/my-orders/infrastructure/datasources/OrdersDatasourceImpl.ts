import { isAxiosError, type AxiosInstance } from 'axios';
import { NotFoundErrorError, OrderConfirmedResponseSchema, OrderDetailsToUpdateResponseSchema, OrderItemsDetailsResponseSchema, OrdersDatasource, OrdersPaginatedSchema, OrdersResponseSchema, OrderTotalsResponseSchema, UploadFileResponseSchema, type AddItemForm, type CreateOrderPayload, type Order, type OrderDetails, type OrderDetailsToUpdate, type OrderItemDetails, type OrderTotals, type PaginatedOrders, type UploadFileResponse } from '@/features/my-orders/my-orders';
import type { OrderFilters } from '@/features/shared/shared';

export class OrdersDatasourceImpl implements OrdersDatasource {

    constructor(private api: AxiosInstance) { }

    async uploadFile(file: File): Promise<UploadFileResponse> {
        try {
            const url = '/orders/uploadFile';
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await this.api.post(url, formData);

            const response = UploadFileResponseSchema.safeParse(data);

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

    async updateOrderItemById(orderId: string, itemId: string, payload: AddItemForm): Promise<string> {
        try {
            const url = `/orders/updateOrderItemById/${orderId}/${itemId}`;
            const { data } = await this.api.patch(url, payload);


            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

    async getOrderItemById(id: string): Promise<OrderDetailsToUpdate> {
        try {
            const url = `/orders/getOrderItemById/${id}`;
            const { data } = await this.api.get(url);
            const response = OrderDetailsToUpdateResponseSchema.safeParse(data);

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

    async confirmReceivedOrder(orderId: Order['id']): Promise<string> {
        try {
            const url = `/orders/confirmReceivedOrder/${orderId}`;
            const { data } = await this.api.post(url);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

    async confirmOrder(orderId: Order['id']): Promise<string> {
        try {
            const url = `/orders/confirmOrder/${orderId}`;
            const { data } = await this.api.post(url);

            return data['message'];
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data['statusCode'] == 404) throw new NotFoundErrorError(error.response.data['message']);
                throw new Error(error.response?.data['message']);
            }

            throw new Error("Error no controlado");
        }
    }

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

    async getOrderById(id: string): Promise<OrderDetails> {
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

    async deleteOrderProduct(orderId: Order['id'], id: OrderItemDetails['id']): Promise<string> {
        try {
            const url = `/orders/deleteItem/${orderId}/${id}`;
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

    async getOrders(filters: OrderFilters): Promise<Order[]> {
        try {
            const url = `/orders?client=${filters.client}&startDate=${filters.startDate}&endDate=${filters.endDate}`;
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

    async createOrder(payload: CreateOrderPayload): Promise<string> {
        try {
            const url = '/orders';
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