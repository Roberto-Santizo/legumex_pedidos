import type { Order } from "../domain";

export abstract class OrdersDatasource {
    abstract createOrder(): Promise<string>;
    abstract getOrders(): Promise<Order[]>;
}