// Created by Luis

import { ApiResponseSchema } from '@/features/shared/shared';
import z from 'zod';

// ─── Nested schemas ───────────────────────────────────────────────────────────

// Normalizes dc from either a plain string or a DC object {id,name,...} to a string name.
// Also handles null and undefined (missing field).
const normalizeDc = (v: unknown): string | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && 'name' in v) return (v as { name: string }).name;
    return null;
};

// Extracts numeric id from a DC object, or passes through a plain number.
const normalizeDcId = (v: unknown): number | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number') return v;
    if (typeof v === 'object' && 'id' in v) return (v as { id: number }).id;
    return null;
};

export const OrderItemSchema = z.object({
    productName: z.string().nullable().default(null),
    internationalCode: z.string().nullable().default(null),
    totalBoxes: z.number(),
    po: z.string().nullable().default(null),
});

export const OrderSummarySchema = z.object({
    id: z.number(),
    client: z.object({ id: z.number(), name: z.string() }).nullable(),
    transportType: z.string().default(''),
    dc: z.preprocess(normalizeDc, z.string().nullable()),
    requiredByDate: z.string().default(''),
    totalPallets: z.number(),
    totalPounds: z.number(),
    totalBoxes: z.number(),
    items: z.array(OrderItemSchema),
    inContainerId: z.number().nullable(),
    exceedsLimits: z.boolean().default(false),
});

export const ContainerDetailSchema = z.object({
    id: z.number(),
    transportType: z.string(),
    dc: z.preprocess(normalizeDc, z.string().nullable()),
    dcId: z.preprocess(normalizeDcId, z.number().nullable()),
    weekStart: z.string(),
    weekEnd: z.string(),
    status: z.enum(['draft', 'confirmed']),
    totalPallets: z.number(),
    totalPounds: z.number(),
    totalOrders: z.number(),
    orders: z.array(OrderSummarySchema),
    createdBy: z.string().nullable(),
    createdAt: z.string(),
    confirmedAt: z.string().nullable(),
    confirmedBy: z.string().nullable(),
    carrier: z.object({ id: z.number(), name: z.string(), shippingCost: z.number() }).nullable().default(null),
    carrierCostSnapshot: z.number().nullable().default(null),
});

// ─── Response schemas ─────────────────────────────────────────────────────────

export const WeekViewResponseSchema = ApiResponseSchema.extend({
    data: z.object({
        week: z.object({ start: z.string(), end: z.string() }),
        isCurrentWeek: z.boolean(),
        isReadonly: z.boolean(),
        availableOrders: z.array(OrderSummarySchema),
        containers: z.array(ContainerDetailSchema),
    }),
});

export const ContainerDetailResponseSchema = ApiResponseSchema.extend({
    data: ContainerDetailSchema,
});
