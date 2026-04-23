// Created by Luis

import { ApiResponseSchema } from '@/features/shared/shared';
import z from 'zod';

export const CarrierSchema = z.object({
    id: z.number(),
    name: z.string(),
    shippingCost: z.number(),
    rateUpdatedAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const CarrierListResponseSchema = ApiResponseSchema.extend({
    data: z.array(CarrierSchema),
});

export const CarrierResponseSchema = ApiResponseSchema.extend({
    data: CarrierSchema,
});
