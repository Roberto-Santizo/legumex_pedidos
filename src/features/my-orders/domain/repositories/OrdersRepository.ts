import type { AddItemForm, Order, OrderItemDetails, OrderTotals } from "../domain";

export abstract class OrdersRepository {
    abstract createOrder(): Promise<string>;
    abstract getOrders(): Promise<Order[]>;
    abstract getOrderDetails(id: string): Promise<OrderTotals>;
    abstract addItemToOrder(id: string, payload: AddItemForm): Promise<string>;
    abstract getOrderProducts(id: string): Promise<OrderItemDetails[]>;
    abstract deleteOrderProduct(id: OrderItemDetails['id']): Promise<string>;
}