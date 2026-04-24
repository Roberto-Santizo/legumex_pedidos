import type { Order } from "@/features/my-orders/my-orders";
import type { Column } from "@/features/shared/domain/types/types";

export const columns: Column<Order>[] = [
  { header: 'id', accessor: 'id', id: 'id' },
  { header: 'Client', accessor: 'client', id: 'client' },
  { header: 'Dc', accessor: 'dc', id: 'dc' },
  { header: 'Total Lbs', accessor: 'total_lbs', id: 'total_lbs' },
  { header: 'Total Pallets', accessor: 'total_pallets', id: 'total_pallets' },
  { header: 'Total Price', accessor: 'total_price', id: 'total_price' },
  { header: 'Total Boxes', accessor: 'total_boxes', id: 'total_boxes' },
  { header: 'Transport Type', accessor: 'transportType', id: 'transportType' },
  { header: 'Required By Date', accessor: 'requiredByDate', id: 'requiredByDate' },
  { header: 'Confirmed By', accessor: 'confirmedBy', id: 'confirmedBy' },
];
