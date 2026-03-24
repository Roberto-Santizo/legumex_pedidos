import type { AddItemForm, CreateOrderPayload, OrderItemDetails, OrdersRepository } from "../../my-orders";

export class OrdersProvider {
    constructor(private repository: OrdersRepository) { }

    async createOrder(payload: CreateOrderPayload) {
        return this.repository.createOrder(payload);
    }

    async getOrders() {
        return this.repository.getOrders();
    }

    async getPaginatedOrders(limit: number, offset: number) {
        return this.repository.getPaginatedOrders(limit, offset);
    }

    async getOrderById(id: string) {
        return this.repository.getOrderById(id);
    }

    async getOrderTotals(id: string) {
        return this.repository.getOrderDetails(id);
    }

    async addItemToOrder({ id, payload }: { id: string, payload: AddItemForm }) {
        return this.repository.addItemToOrder(id, payload);
    }

    async getOrderProducts(id: string) {
        return this.repository.getOrderProducts(id);
    }

    async deleteOrderProduct(id: OrderItemDetails['id']) {
        return this.repository.deleteOrderProduct(id);
    }
}