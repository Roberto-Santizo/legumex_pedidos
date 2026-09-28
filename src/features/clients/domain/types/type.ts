import type { ClientSchema, PaginatedClientsResponseSchema } from "../schemas/schemas";
import type z from "zod";

export type Client = z.infer<typeof ClientSchema>;
export type PaginatedClients = z.infer<typeof PaginatedClientsResponseSchema>;
