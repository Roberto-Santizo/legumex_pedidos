import type z from "zod";
import type { OrderItemDetailsSchema, OrderSchema, OrderTotalsSchema } from "../domain";

export type Order = z.infer<typeof OrderSchema>;
export type OrderTotals = z.infer<typeof OrderTotalsSchema>;
export type OrderItemDetails = z.infer<typeof OrderItemDetailsSchema>;