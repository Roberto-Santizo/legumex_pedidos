export interface NotificationAdapter {
    success(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    information(message: string): void;
}


export interface OrderFiltersReports {
    year: string;
    week: string;
}

export interface UploadFileForm {
    file: File | null;
    year: number;
    week: number;
}