import type { OrderFiltersReports, UploadFileForm } from "@/features/shared/shared";
import type { AddItemForm, CreateOrderPayload, Order, OrderFilters, OrderItemDetails, OrdersRepository } from "../../my-orders";

export class OrdersProvider {
    constructor(private repository: OrdersRepository) { }

    async createOrder(payload: CreateOrderPayload) {
        return this.repository.createOrder(payload);
    }

    async getOrders(filters: OrderFiltersReports) {
        return this.repository.getOrders(filters);
    }

    async getPaginatedOrders({ limit, offset, filters }: { limit: number, offset: number, filters: OrderFilters }) {
        return this.repository.getPaginatedOrders({ limit, offset, filters });
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

    async uploadFile(payload: UploadFileForm) {
        return this.repository.uploadFile(payload);
    }

    async downloadHeadersReport(startDate: string, endDate: string) {
        return this.repository.downloadHeadersReport(startDate, endDate);
    }

    async downloadItemsReport(startDate: string, endDate: string) {
        return this.repository.downloadItemsReport(startDate, endDate);
    }
}