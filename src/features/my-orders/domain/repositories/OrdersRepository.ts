import type { OrderFiltersReports, UploadFileForm } from "@/features/shared/shared";
import type { AddItemForm, CreateOrderPayload, Order, OrderDetails, OrderDetailsToUpdate, OrderEditDetails, OrderFilters, OrderItemDetails, OrderTotals, PaginatedOrders, UploadFileResponse } from "../domain";

export abstract class OrdersRepository {
    abstract uploadFile(payload: UploadFileForm): Promise<UploadFileResponse>;
    abstract createOrder(payload: CreateOrderPayload): Promise<string>;
    abstract getOrders(filters: OrderFiltersReports): Promise<Order[]>;
    abstract getPaginatedOrders({ limit, offset, filters }: { limit: number, offset: number, filters: OrderFilters }): Promise<PaginatedOrders>;
    abstract getOrderById(id: string): Promise<OrderDetails>;
    abstract getOrderEditDetailsById(id: string): Promise<OrderEditDetails>;
    abstract getOrderDetails(id: string): Promise<OrderTotals>;
    abstract updateOrder(id: string, payload: CreateOrderPayload): Promise<string>;
    abstract addItemToOrder(id: string, payload: AddItemForm): Promise<string>;
    abstract getOrderProducts(id: string): Promise<OrderItemDetails[]>;
    abstract getOrderItemById(id: string): Promise<OrderDetailsToUpdate>;
    abstract updateOrderItemById(orderId: string, itemId: string, payload: AddItemForm): Promise<string>;
    abstract deleteOrderProduct(orderId: Order['id'], id: OrderItemDetails['id']): Promise<string>;
    abstract confirmOrder(orderId: Order['id']): Promise<string>;
    abstract confirmReceivedOrder(orderId: Order['id']): Promise<string>;
    abstract downloadHeadersReport(year: string, week: string): Promise<Blob>;
    abstract downloadItemsReport(year: string, week: string): Promise<Blob>;
    abstract downloadOrderDetailsReport(year: string, week: string): Promise<Blob>;
    abstract deleteOrderById(order: Order['id']): Promise<string>;
}