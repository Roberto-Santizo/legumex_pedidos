import type { OrderFilters } from "@/features/shared/shared";
import type { AddItemForm, CreateOrderPayload, Order, OrderDetails, OrderDetailsToUpdate, OrderItemDetails, OrderTotals, PaginatedOrders } from "../domain";

export abstract class OrdersRepository {
    abstract uploadFile(file: File): Promise<string>;
    abstract createOrder(payload: CreateOrderPayload): Promise<string>;
    abstract getOrders(filters: OrderFilters): Promise<Order[]>;
    abstract getPaginatedOrders(limit: number, offset: number): Promise<PaginatedOrders>;
    abstract getOrderById(id: string): Promise<OrderDetails>;
    abstract getOrderDetails(id: string): Promise<OrderTotals>;
    abstract addItemToOrder(id: string, payload: AddItemForm): Promise<string>;
    abstract getOrderProducts(id: string): Promise<OrderItemDetails[]>;
    abstract getOrderItemById(id: string): Promise<OrderDetailsToUpdate>;
    abstract updateOrderItemById(orderId: string, itemId: string, payload: AddItemForm): Promise<string>;
    abstract deleteOrderProduct(orderId: Order['id'], id: OrderItemDetails['id']): Promise<string>;
    abstract confirmOrder(orderId: Order['id']): Promise<string>;
    abstract confirmReceivedOrder(orderId: Order['id']): Promise<string>;
}