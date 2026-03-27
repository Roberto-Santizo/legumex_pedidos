import type z from "zod";
import type { PaginatedProductsResponseSchema, ProductPriceDetail, ProductSchema } from "../domain";

export type Product = z.infer<typeof ProductSchema>;
export type ProductPrice = z.infer<typeof ProductPriceDetail>;
export type PaginatedProducts = z.infer<typeof PaginatedProductsResponseSchema>;