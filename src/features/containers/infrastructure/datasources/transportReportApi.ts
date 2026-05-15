
import api from "@/config/http/axios";
import { isAxiosError } from "axios";

export interface TransportReportFilters {
    from: string;
    to: string;
    carrierId?: number;
    dc?: string;
    status?: "confirmed" | "draft";
}

export async function downloadTransportCostReport(filters: TransportReportFilters): Promise<void> {
    try {
        const params: Record<string, string | number> = {
            from: filters.from,
            to:   filters.to,
        };
        if (filters.carrierId) params.carrierId = filters.carrierId;
        if (filters.dc)        params.dc        = filters.dc;
        if (filters.status)    params.status    = filters.status;

        const { data } = await api.get("/reports/transport-cost", {
            params,
            responseType: "blob",
        });

        const url      = URL.createObjectURL(data as Blob);
        const anchor   = document.createElement("a");
        anchor.href    = url;
        anchor.download = `reporte_transporte_${filters.from}_${filters.to}.xlsx`;
        anchor.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        if (isAxiosError(error)) throw new Error(error.response?.data?.message ?? error.message);
        throw error;
    }
}
