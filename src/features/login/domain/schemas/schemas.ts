import z from "zod";

//USER SCHEMA 
export const UserSchema = z.object({
    name: z.string(),
    email: z.string(),
    role: z.string(),
    token: z.string(),
    refreshToken: z.string()
});

export type User = z.infer<typeof UserSchema>;