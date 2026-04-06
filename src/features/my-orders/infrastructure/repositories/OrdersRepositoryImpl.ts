import { OrdersDatasource, OrdersRepository, type AddItemForm, type CreateOrderPayload, type Order, type OrderDetails, type OrderDetailsToUpdate, type OrderItemDetails, type OrderTotals, type PaginatedOrders } from '@/features/my-orders/my-orders';
import type { OrderFilters } from '@/features/shared/shared';

export class OrdersRepositoryImpl implements OrdersRepository {
    constructor(private datasource: OrdersDatasource) { }

    updateOrderItemById(orderId: string, itemId: string, payload: AddItemForm): Promise<string> {
        return this.datasource.updateOrderItemById(orderId, itemId, payload);
    }

    getOrderItemById(id: string): Promise<OrderDetailsToUpdate> {
        return this.datasource.getOrderItemById(id);
    }

    confirmReceivedOrder(orderId: Order['id']): Promise<string> {
        return this.datasource.confirmReceivedOrder(orderId);
    }

    confirmOrder(orderId: Order['id']): Promise<string> {
        return this.datasource.confirmOrder(orderId);
    }

    getPaginatedOrders(limit: number, offset: number): Promise<PaginatedOrders> {
        return this.datasource.getPaginatedOrders(limit, offset);
    }

    getOrderById(id: string): Promise<OrderDetails> {
        return this.datasource.getOrderById(id);
    }

    deleteOrderProduct(orderId: Order['id'], id: OrderItemDetails['id']): Promise<string> {
        return this.datasource.deleteOrderProduct(orderId, id);
    }

    getOrderProducts(id: string): Promise<OrderItemDetails[]> {
        return this.datasource.getOrderProducts(id);
    }

    addItemToOrder(id: string, payload: AddItemForm): Promise<string> {
        return this.datasource.addItemToOrder(id, payload);
    }

    getOrderDetails(id: string): Promise<OrderTotals> {
        return this.datasource.getOrderDetails(id);
    }

    getOrders(filters: OrderFilters): Promise<Order[]> {
        return this.datasource.getOrders(filters);
    }

    createOrder(payload: CreateOrderPayload): Promise<string> {
        return this.datasource.createOrder(payload);
    }

}