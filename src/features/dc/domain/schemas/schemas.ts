import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const DcSchema = z.object({
    id: z.number(),
    name: z.string()
});

export const DcResponseSchema = ApiResponseSchema.extend({
    data: z.array(DcSchema)
});