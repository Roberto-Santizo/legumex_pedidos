import type { AddItemForm, CreateOrderPayload, Order, OrderConfirmed, OrderItemDetails, OrderTotals, PaginatedOrders } from "../domain";

export abstract class OrdersRepository {
    abstract createOrder(payload: CreateOrderPayload): Promise<string>;
    abstract getOrders(): Promise<Order[]>;
    abstract getPaginatedOrders(limit: number, offset: number): Promise<PaginatedOrders>;
    abstract getOrderById(id: string): Promise<OrderConfirmed>;
    abstract getOrderDetails(id: string): Promise<OrderTotals>;
    abstract addItemToOrder(id: string, payload: AddItemForm): Promise<string>;
    abstract getOrderProducts(id: string): Promise<OrderItemDetails[]>;
    abstract deleteOrderProduct(id: OrderItemDetails['id']): Promise<string>;
}