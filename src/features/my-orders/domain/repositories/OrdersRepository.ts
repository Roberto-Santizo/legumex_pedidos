import type { Order } from "../domain";

export abstract class OrdersRepository {
    abstract createOrder(): Promise<string>;
    abstract getOrders(): Promise<Order[]>;
}