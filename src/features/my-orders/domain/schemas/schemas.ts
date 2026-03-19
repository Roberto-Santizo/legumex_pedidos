import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const OrderSchema = z.object({
    id: z.number(),
    createdAt: z.string(),
    user: z.string(),
})

export const OrderTotalsSchema = z.object({
    total_boxes: z.number(),
    total_price: z.string()
});

export const OrderTotalsResponseSchema = ApiResponseSchema.extend({
    data: OrderTotalsSchema
});

export const OrdersResponseSchema = ApiResponseSchema.extend({
    data: z.array(OrderSchema)
});
