import { ApiResponseSchema } from "@/features/shared/shared";
import z from "zod";

export const OrderSchema = z.object({
    id: z.number(),
    createdAt: z.string(),
    user: z.string(),
    status: z.number(),
    total_lbs: z.number(),
    total_pallets: z.number(),
    total_price: z.number(),
    total_boxes: z.number(),
    client: z.string(),
    transportType: z.string(),
    requiredByDate: z.string(),
    confirmedBy: z.string().nullable(),
    dc: z.string(),
    po: z.string(),
});

export const OrdersPaginatedSchema = ApiResponseSchema.extend({
    data: z.object({
        response: z.array(OrderSchema),
        total: z.number(),
        page: z.number(),
        lastPage: z.number()
    })
});

export const OrderDetailsSchema = z.object({
    id: z.number(),
    status: z.number(),
    customer: z.string(),
    email: z.string(),
    dc_id: z.number(),
    dc: z.string(),
    po: z.string(),
    client: z.string(),
    client_id: z.number(),
    transportType: z.string(),
    date: z.string(),
    confirmationDate: z.string().nullable(),
    requiredDate: z.string(),
    receviedConfirmatioDate: z.string().nullable(),
    confirmedBy: z.string().nullable()
});

export const OrderConfirmedResponseSchema = ApiResponseSchema.extend({
    data: OrderDetailsSchema
});

export const OrderItemDetailsSchema = z.object({
    id: z.number(),
    total_boxes: z.number(),
    total_lbs: z.number(),
    total_pallets: z.number(),
    total_amount: z.number(),
    product: z.string(),
    internationalCode: z.string(),
});

export const OrderItemsDetailsResponseSchema = ApiResponseSchema.extend({
    data: z.array(OrderItemDetailsSchema)
});

export const OrderTotalsSchema = z.object({
    total_boxes: z.number(),
    total_price: z.number(),
    total_lbs: z.number(),
    total_pallets: z.number()
});

export const OrderTotalsResponseSchema = ApiResponseSchema.extend({
    data: OrderTotalsSchema
});

export const OrdersResponseSchema = ApiResponseSchema.extend({
    data: z.array(OrderSchema)
});

export const OrderDetailsToUpdateSchema = z.object({
    id: z.number(),
    total_boxes: z.number(),
    product_id: z.number()
});

export const OrderDetailsToUpdateResponseSchema = ApiResponseSchema.extend({
    data: OrderDetailsToUpdateSchema
});


//!REFACTORIZAR
export const CreationOrderResultSchema = z.object({
    success: z.boolean(),
    message: z.string()
})

export const UploadFileResponseSchema = ApiResponseSchema.extend({
    data: z.object({
        total: z.number(),
        success: z.number(),
        failed: z.number(),
        results: z.array(CreationOrderResultSchema)
    })
});