import type z from "zod";
import type { PaginatedUsersResponseSchema, UserSchema } from "../domain";

export type User  = z.infer<typeof UserSchema>;
export type PaginatedUsers = z.infer<typeof PaginatedUsersResponseSchema>;
