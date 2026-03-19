import { OrdersDatasource, OrdersRepository, type Order } from '@/features/my-orders/my-orders';

export class OrdersRepositoryImpl implements OrdersRepository {
    constructor(private datasource: OrdersDatasource){}

    getOrders(): Promise<Order[]> {
        return this.datasource.getOrders();
    }

    createOrder(): Promise<string> {
        return this.datasource.createOrder();
    }

}