import { OrdersDatasource, OrdersRepository, type AddItemForm, type Order, type OrderItemDetails, type OrderTotals } from '@/features/my-orders/my-orders';

export class OrdersRepositoryImpl implements OrdersRepository {
    constructor(private datasource: OrdersDatasource){}

    deleteOrderProduct(id: OrderItemDetails['id']): Promise<string> {
        return this.datasource.deleteOrderProduct(id);
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

    getOrders(): Promise<Order[]> {
        return this.datasource.getOrders();
    }

    createOrder(): Promise<string> {
        return this.datasource.createOrder();
    }

}