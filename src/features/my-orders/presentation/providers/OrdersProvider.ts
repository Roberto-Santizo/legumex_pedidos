import type { AddItemForm, OrderItemDetails, OrdersRepository } from "../../my-orders";

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

    async getOrderProducts(id: string) {
        return this.repository.getOrderProducts(id);
    }

    async deleteOrderProduct(id: OrderItemDetails['id']){
        return this.repository.deleteOrderProduct(id);
    }
}