import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const ProductPriceDetail = z.object({
    id: z.number(),
    last_price: z.number(),
    new_price: z.number(),
    createdAt: z.string(),
});

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    localCode: z.string(),
    internationalCode: z.string(),
    auxCode: z.string(),
    price: z.number(),
    presentation: z.number(),
    units_per_box: z.number(),
    boxes_per_pallet: z.number(),
    client_id: z.number(),
    client: z.string(),
    prices: z.array(ProductPriceDetail).optional(),
    dc: z.string(),
    dc_id: z.number(),
    transportType: z.string()
});

export const ProductsResponseSchema = ApiResponseSchema.extend({
    data: z.array(ProductSchema)
});

export const PaginatedProductsResponseSchema = ApiResponseSchema.extend({
    data: z.object({
        response: z.array(ProductSchema),
        total: z.number(),
        page: z.number(),
        lastPage: z.number()
    })
});