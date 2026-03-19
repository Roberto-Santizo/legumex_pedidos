import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    localCode: z.string(),
    internationalCode: z.string(),
    price: z.number(),
    presentation: z.number(),
});

export const ProductsResponseSchema = ApiResponseSchema.extend({
    data: z.array(ProductSchema)
});