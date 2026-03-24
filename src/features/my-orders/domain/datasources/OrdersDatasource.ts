import type { AddItemForm, CreateOrderPayload, Order, OrderDetails, OrderItemDetails, OrderTotals, PaginatedOrders } from "../domain";

export abstract class OrdersDatasource {
    abstract createOrder(payload: CreateOrderPayload): Promise<string>;
    abstract getOrders(): Promise<Order[]>;
    abstract getPaginatedOrders(limit: number, offset: number): Promise<PaginatedOrders>;
    abstract getOrderById(id: string): Promise<OrderDetails>;
    abstract getOrderDetails(id: string): Promise<OrderTotals>;
    abstract addItemToOrder(id: string, payload: AddItemForm): Promise<string>;
    abstract getOrderProducts(id: string): Promise<OrderItemDetails[]>;
    abstract deleteOrderProduct(orderId: Order['id'], id: OrderItemDetails['id']): Promise<string>;
    abstract confirmOrder(orderId: Order['id']): Promise<string>;
    abstract confirmReceivedOrder(orderId: Order['id']): Promise<string>;
}