import z from "zod";

export const ClientSchema = z.object({
    id: z.number(),
    name: z.string()
});

export const ClientsResponseSchema = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(ClientSchema)
});