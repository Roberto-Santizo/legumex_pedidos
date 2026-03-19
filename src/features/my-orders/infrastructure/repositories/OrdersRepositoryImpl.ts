import { OrdersDatasource, OrdersRepository, type Order, type OrderTotals } from '@/features/my-orders/my-orders';

export class OrdersRepositoryImpl implements OrdersRepository {
    constructor(private datasource: OrdersDatasource){}

    getOrderDetails(id: string): Promise<OrderTotals> {
        return this.datasource.getOrderDetails(id);
    }

    getOrders(): Promise<Order[]> {
        return this.datasource.getOrders();
    }

    createOrder(): Promise<string> {
        return this.datasource.createOrder();
    }

}