import { OrdersDatasource, OrdersRepository, type AddItemForm, type CreateOrderPayload, type Order, type OrderDetails, type OrderDetailsToUpdate, type OrderFilters, type OrderItemDetails, type OrderTotals, type PaginatedOrders, type UploadFileResponse } from '@/features/my-orders/my-orders';
import type { OrderFiltersReports, UploadFileForm } from '@/features/shared/shared';

export class OrdersRepositoryImpl implements OrdersRepository {
    constructor(private datasource: OrdersDatasource) { }

    downloadItemsReport(startDate: string, endDate: string): Promise<Blob> {
        return this.datasource.downloadItemsReport(startDate, endDate);
    }

    downloadHeadersReport(startDate: string, endDate: string): Promise<Blob> {
        return this.datasource.downloadHeadersReport(startDate, endDate);
    }

    uploadFile(payload: UploadFileForm): Promise<UploadFileResponse> {
        return this.datasource.uploadFile(payload);
    }

    updateOrderItemById(orderId: string, itemId: string, payload: AddItemForm): Promise<string> {
        return this.datasource.updateOrderItemById(orderId, itemId, payload);
    }

    getOrderItemById(id: string): Promise<OrderDetailsToUpdate> {
        return this.datasource.getOrderItemById(id);
    }

    confirmReceivedOrder(orderId: Order['id']): Promise<string> {
        return this.datasource.confirmReceivedOrder(orderId);
    }

    confirmOrder(orderId: Order['id']): Promise<string> {
        return this.datasource.confirmOrder(orderId);
    }

    getPaginatedOrders({ limit, offset, filters }: { limit: number, offset: number, filters: OrderFilters }): Promise<PaginatedOrders> {
        return this.datasource.getPaginatedOrders({ limit, offset, filters });
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

    getOrders(filters: OrderFiltersReports): Promise<Order[]> {
        return this.datasource.getOrders(filters);
    }

    createOrder(payload: CreateOrderPayload): Promise<string> {
        return this.datasource.createOrder(payload);
    }

}