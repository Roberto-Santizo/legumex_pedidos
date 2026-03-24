import type z from "zod";
import type { OrderDetailsSchema, OrderItemDetailsSchema, OrderSchema, OrdersPaginatedSchema, OrderTotalsSchema } from "../domain";

export type Order = z.infer<typeof OrderSchema>;
export type OrderTotals = z.infer<typeof OrderTotalsSchema>;
export type OrderItemDetails = z.infer<typeof OrderItemDetailsSchema>;
export type OrderDetails = z.infer<typeof OrderDetailsSchema>;
export type PaginatedOrders = z.infer<typeof OrdersPaginatedSchema>;