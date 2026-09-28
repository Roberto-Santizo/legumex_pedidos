import type z from "zod";
import type { DcSchema, PaginatedDcsResponseSchema } from "../schemas/schemas";

export type Dc = z.infer<typeof DcSchema>;
export type PaginatedDcs = z.infer<typeof PaginatedDcsResponseSchema>;
