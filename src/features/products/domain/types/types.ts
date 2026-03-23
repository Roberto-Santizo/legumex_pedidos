import type z from "zod";
import type { PaginatedProductsResponseSchema, ProductSchema } from "../domain";

export type Product = z.infer<typeof ProductSchema>;
export type PaginatedProducts = z.infer<typeof PaginatedProductsResponseSchema>;