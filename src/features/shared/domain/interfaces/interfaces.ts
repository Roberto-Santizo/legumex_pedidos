export interface NotificationAdapter {
    success(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    information(message: string): void;
}


export interface OrderFilters {
    client: string;
    startDate: string;
    endDate: string;
}