import type z from "zod";
import type { CreationOrderResultSchema, OrderDetailsSchema, OrderDetailsToUpdateSchema, OrderItemDetailsSchema, OrderSchema, OrdersPaginatedSchema, OrderTotalsSchema, UploadFileResponseSchema } from "../domain";

export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderTotals = z.infer<typeof OrderTotalsSchema>;
export type OrderItemDetails = z.infer<typeof OrderItemDetailsSchema>;
export type OrderDetails = z.infer<typeof OrderDetailsSchema>;
export type OrderDetailsToUpdate = z.infer<typeof OrderDetailsToUpdateSchema>;
export type PaginatedOrders = z.infer<typeof OrdersPaginatedSchema>;
export type CreationOrderResult = z.infer<typeof CreationOrderResultSchema>;