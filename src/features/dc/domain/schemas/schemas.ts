import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const DcSchema = z.object({
    id: z.number(),
    name: z.string(),
    client: z.string(),
    code: z.string(),
    warehouse: z.string(),
});

export const DcResponseSchema = ApiResponseSchema.extend({
    data: z.array(DcSchema)
});
export const PaginatedDcsResponseSchema = ApiResponseSchema.extend({
    data: z.object({
        response: z.array(DcSchema),
        total: z.number(),
        page: z.number(),
        lastPage: z.number()
    })
});
