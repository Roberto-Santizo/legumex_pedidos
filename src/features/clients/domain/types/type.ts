import type { ClientSchema } from "../schemas/schemas";
import type z from "zod";

export type Client = z.infer<typeof ClientSchema>;