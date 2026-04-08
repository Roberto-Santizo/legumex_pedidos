import type z from "zod";
import type { DcSchema } from "../schemas/schemas";

export type Dc = z.infer<typeof DcSchema>;