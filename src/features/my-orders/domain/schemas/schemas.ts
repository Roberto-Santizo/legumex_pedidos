import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const OrderSchema = z.object({
    id: z.number(),
    createdAt: z.string(),
    user: z.string(),
})

export const OrdersResponseSchema = ApiResponseSchema.extend({
    data: z.array(OrderSchema)
})