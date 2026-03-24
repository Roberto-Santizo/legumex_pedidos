import { OrdersDatasource, OrdersRepository, type AddItemForm, type CreateOrderPayload, type Order, type OrderDetails, type OrderItemDetails, type OrderTotals, type PaginatedOrders } from '@/features/my-orders/my-orders';

export class OrdersRepositoryImpl implements OrdersRepository {
    constructor(private datasource: OrdersDatasource) { }

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

    getOrders(): Promise<Order[]> {
        return this.datasource.getOrders();
    }

    createOrder(payload: CreateOrderPayload): Promise<string> {
        return this.datasource.createOrder(payload);
    }

}