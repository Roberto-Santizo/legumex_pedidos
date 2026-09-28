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
export const PaginatedUsersResponseSchema = ApiResponseSchema.extend({
    data: z.object({
        response: z.array(UserSchema),
        total: z.number(),
        page: z.number(),
        lastPage: z.number()
    })
});
