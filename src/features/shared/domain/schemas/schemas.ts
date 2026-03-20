import z from "zod";

export const ApiResponseSchema = z.object({
    statusCode: z.number(),
    message: z.string()
});
