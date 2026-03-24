import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string()
});

export const UsersResponseSchema = ApiResponseSchema.extend({
    data: z.array(UserSchema)
});