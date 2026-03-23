import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    localCode: z.string(),
    internationalCode: z.string(),
    price: z.number(),
    presentation: z.number(),
    units_per_box: z.number(),
    client_id: z.number(),
    client: z.string()
});

export const ProductsResponseSchema = ApiResponseSchema.extend({
    data: z.array(ProductSchema)
});