// Created by Luis

import type z from 'zod';
import type { CarrierSchema } from '../schemas/schemas';

export type Carrier = z.infer<typeof CarrierSchema>;
