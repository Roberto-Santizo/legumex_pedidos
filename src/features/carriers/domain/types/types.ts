// Created by Luis

import type z from 'zod';
import type { CarrierRateSchema, CarrierSchema } from '../schemas/schemas';

export type Carrier = z.infer<typeof CarrierSchema>;
export type CarrierRate = z.infer<typeof CarrierRateSchema>;
