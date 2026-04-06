import type { OrderFilters } from "@/features/shared/shared";
import type { AddItemForm, CreateOrderPayload, Order, OrderItemDetails, OrdersRepository } from "../../my-orders";

export class OrdersProvider {
    constructor(private repository: OrdersRepository) { }

    async createOrder(payload: CreateOrderPayload) {
        return this.repository.createOrder(payload);
    }

    async getOrders(filters: OrderFilters) {
        return this.repository.getOrders(filters);
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

    async deleteOrderProduct(orderId: Order['id'], id: OrderItemDetails['id']) {
        return this.repository.deleteOrderProduct(orderId, id);
    }

    async confirmOrder(orderId: Order['id']) {
        return this.repository.confirmOrder(orderId);
    }

    async confirmReceivedOrder(orderId: Order['id']) {
        return this.repository.confirmReceivedOrder(orderId);
    }

    async getOrderItemById(id: string) {
        return this.repository.getOrderItemById(id);
    }

    async updateOrderItemById(orderId: string, itemId: string, payload: AddItemForm) {
        return this.repository.updateOrderItemById(orderId, itemId, payload);
    }
}