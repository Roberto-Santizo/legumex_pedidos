// Created by Luis

import { ApiResponseSchema } from '@/features/shared/shared';
import z from 'zod';

export const CarrierSchema = z.object({
    id: z.number(),
    name: z.string(),
    shippingCost: z.number(),
    rateUpdatedAt: z.string(),
    // Backend returns dc as a joined object {id, name, code, client} or as flat fields, or absent
    dc: z.object({ id: z.number(), name: z.string(), code: z.string().optional(), client: z.string().optional() }).nullable().optional(),
    dcId: z.number().nullable().optional(),
    dcName: z.string().nullable().optional(),
    clientName: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
}).transform((raw) => ({
    id: raw.id,
    name: raw.name,
    shippingCost: raw.shippingCost,
    rateUpdatedAt: raw.rateUpdatedAt,
    dcId: raw.dc?.id ?? raw.dcId ?? null,
    dcName: raw.dc?.name ?? raw.dcName ?? null,
    clientName: raw.dc?.client ?? raw.clientName ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
}));

export const CarrierListResponseSchema = ApiResponseSchema.extend({
    data: z.array(CarrierSchema),
});

export const CarrierResponseSchema = ApiResponseSchema.extend({
    data: CarrierSchema,
});

export const CarrierRateSchema = z.object({
    id: z.number(),
    cost: z.number(),
    effectiveDate: z.string(),
    createdAt: z.string(),
});

export const CarrierRateListResponseSchema = ApiResponseSchema.extend({
    data: z.array(CarrierRateSchema),
});
