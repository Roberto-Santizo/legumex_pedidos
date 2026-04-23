// Created by Luis

import { ApiResponseSchema } from '@/features/shared/shared';
import z from 'zod';

// ─── Nested schemas ───────────────────────────────────────────────────────────

export const OrderItemSchema = z.object({
    productName: z.string().nullable(),
    internationalCode: z.string().nullable(),
    totalBoxes: z.number(),
    po: z.string().nullable(),
});

export const OrderSummarySchema = z.object({
    id: z.number(),
    client: z.object({ id: z.number(), name: z.string() }).nullable(),
    transportType: z.string(),
    dc: z.string().nullable(),
    requiredByDate: z.string(),
    totalPallets: z.number(),
    totalPounds: z.number(),
    totalBoxes: z.number(),
    items: z.array(OrderItemSchema),
    inContainerId: z.number().nullable(),
    exceedsLimits: z.boolean(),
});

export const ContainerDetailSchema = z.object({
    id: z.number(),
    transportType: z.string(),
    dc: z.string(),
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
