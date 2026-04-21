import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import type { Option } from "@/features/shared/shared";
import type { Product } from "@/features/products/products";
import type { CreationOrderResult } from "@/features/my-orders//my-orders";


export const productsToOptions = (products: Product[]): Option[] => {
    const options: Option[] = products.map((product) => {
        return {
            value: product.id,
            label: `${product.name} - ${product.transportType} - $${product.price}`
        }
    })

    return options;
}

export const handleExportExcel = (orders: CreationOrderResult[]) => {
    const data = orders.map((order) => ({
        Status: order.success ? "Success" : "Error",
        Message: order.message,
    }))

    const worksheet = XLSX.utils.json_to_sheet(data ?? []);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Results');

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    const fileData = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(fileData, 'ORDER RESULTS.xlsx');
};