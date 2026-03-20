import type z from "zod";
import type { OrderConfirmedSchema, OrderItemDetailsSchema, OrderSchema, OrdersPaginatedSchema, OrderTotalsSchema } from "../domain";

export type Order = z.infer<typeof OrderSchema>;
export type OrderTotals = z.infer<typeof OrderTotalsSchema>;
export type OrderItemDetails = z.infer<typeof OrderItemDetailsSchema>;
export type OrderConfirmed = z.infer<typeof OrderConfirmedSchema>;
export type PaginatedOrders = z.infer<typeof OrdersPaginatedSchema>;