import type z from "zod";
import type { ProductSchema } from "../domain";

export type Product = z.infer<typeof ProductSchema>;