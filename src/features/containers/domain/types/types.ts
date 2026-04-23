// Created by Luis

import type z from 'zod';
import type {
    ContainerDetailSchema,
    OrderItemSchema,
    OrderSummarySchema,
} from '../schemas/schemas';

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderSummary = z.infer<typeof OrderSummarySchema>;
export type ContainerDetail = z.infer<typeof ContainerDetailSchema>;
export type ContainerStatus = 'draft' | 'confirmed';

export interface WeekView {
    week: { start: string; end: string };
    isCurrentWeek: boolean;
    isReadonly: boolean;
    availableOrders: OrderSummary[];
    containers: ContainerDetail[];
}

// In-memory draft container (not yet persisted to the DB)
export interface DraftContainer {
    transportType: string;
    dc: string;
    weekStart: string;
    orders: OrderSummary[];
    totalPallets: number; // computed from orders
    totalPounds: number;  // computed from orders
    persistedId: number | null; // null = in-memory only; number = saved as draft in DB
}
