import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const ClientSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
});

export const ClientsResponseSchema = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(ClientSchema)
});

export const PaginatedClientsResponseSchema = ApiResponseSchema.extend({
    data: z.object({
        response: z.array(ClientSchema),
        total: z.number(),
        page: z.number(),
        lastPage: z.number()
    })
});
