import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const OrderSchema = z.object({
    id: z.number(),
    createdAt: z.string(),
    user: z.string(),
    status: z.number()
})

export const OrderItemDetailsSchema = z.object({
    id: z.number(),
    total_boxes: z.number(),
    total_lbs: z.number(),
    total_amount: z.number(),
    product: z.string(),
    internationalCode: z.string(),
    po: z.string()
});

export const OrderItemsDetailsResponseSchema = ApiResponseSchema.extend({
    data: z.array(OrderItemDetailsSchema)
});

export const OrderTotalsSchema = z.object({
    total_boxes: z.number(),
    total_price: z.string(),
    total_lbs: z.string(),
});

export const OrderTotalsResponseSchema = ApiResponseSchema.extend({
    data: OrderTotalsSchema
});

export const OrdersResponseSchema = ApiResponseSchema.extend({
    data: z.array(OrderSchema)
});
