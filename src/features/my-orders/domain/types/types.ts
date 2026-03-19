import type z from "zod";
import type { OrderSchema } from "../domain";

export type Order = z.infer<typeof OrderSchema>;