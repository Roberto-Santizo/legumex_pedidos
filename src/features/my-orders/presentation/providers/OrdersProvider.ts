import type { AddItemForm, OrdersRepository } from "../../my-orders";

export class OrdersProvider {
    constructor(private repository: OrdersRepository) { }

    async createOrder() {
        return this.repository.createOrder();
    }

    async getOrders() {
        return this.repository.getOrders();
    }

    async getOrderTotals(id: string) {
        return this.repository.getOrderDetails(id);
    }

    async addItemToOrder({ id, payload }: { id: string, payload: AddItemForm }) {
        return this.repository.addItemToOrder(id, payload);
    }
}