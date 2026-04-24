import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import type { Order } from '@/features/my-orders/my-orders';

export const handleExportExcel = (orders: Order[]) => {
    const data = orders.map((order) => ({
        Client: order.client,
        DC: order.dc,
        TotalLbs: order.total_lbs,
        TotalPallets: order.total_pallets,
        TotalPrice: order.total_price,
        TotalBoxes: order.total_boxes,
        TransportType: order.transportType,
        RequiredBy: order.requiredByDate,
        ConfirmedBy: order.confirmedBy
    }))

    const worksheet = XLSX.utils.json_to_sheet(data ?? []);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lineas');

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    const fileData = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(fileData, 'REPORT.xlsx');
};

export const dowloadExcelFile = (data: Blob, fileName: string) => {
    const blob = new Blob([data]);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `${fileName}.xlsx`);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
}